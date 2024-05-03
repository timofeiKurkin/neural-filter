import ipaddress
import random

import keras
import numpy as np
from scapy.all import PcapReader
from sklearn.preprocessing import MinMaxScaler

np.set_printoptions(suppress=True)


async def read_pcap(*, pcap_path):
    packages = PcapReader(pcap_path)
    packages_list = set()

    for package_data in packages:
        package_array = np.array([])

        if (
                package_data.haslayer("IP") and package_data.haslayer("TCP")
        ):
            # # Header
            # mac_dst = int(package_data.fields["dst"].replace(":", ""), 16)
            # mac_src = int(package_data.fields["src"].replace(":", ""), 16)

            # # IP layer
            # ip_src = int(ipaddress.IPv4Address(package_data['IP'].src))
            # ip_dst = int(ipaddress.IPv4Address(package_data['IP'].dst))

            (ip_src, ip_dst), (mac_dst, mac_src) = await formated_package(
                ip_addresses=[package_data['IP'].dst, package_data['IP'].src],
                mac_addresses=[package_data.fields["dst"], package_data.fields["src"]])

            ip_len = package_data['IP'].len
            ip_proto = package_data['IP'].proto

            # TCP layer
            tcp_sport = package_data['TCP'].sport
            tcp_dport = package_data['TCP'].dport

            package_new_array = np.array([
                mac_dst,
                mac_src,
                ip_src,
                ip_dst,
                tcp_sport,
                tcp_dport,
                ip_len,
                ip_proto
            ])

            package_array = np.append(package_array, package_new_array)

        if len(package_array) == 8:
            packages_list.add(tuple(package_array))

    if len(packages_list) != 0:
        return np.array(list(packages_list))
    else:
        return []


async def formated_package(*, ip_addresses, mac_addresses):
    ip_addresses_encoded = [int(ipaddress.IPv4Address(ip)) / 100 for ip in ip_addresses]
    mac_addresses_encoded = [int(mac_address.replace(":", ""), 16) / 10000000 for mac_address in mac_addresses]

    return ip_addresses_encoded, mac_addresses_encoded


async def encoded_embedding_model(*, input_length):
    encoded_model = keras.Sequential([
        keras.layers.Embedding(
            input_dim=input_length + 1,
            output_dim=8,
        ),
        keras.layers.Dense(units=8, activation=keras.activations.relu),
    ])
    encoded_model.compile(
        optimizer=keras.optimizers.Adam(),
        loss=keras.losses.MeanSquaredError()
    )
    return encoded_model


async def expand_dimension(*, encoded_packages):
    new_encoded_packages = []

    for packages in encoded_packages:
        package_data = np.array([[np.expand_dims(package_item, axis=0) for package_item in package]
                                 for package in packages])
        new_encoded_packages.append(package_data)

    return np.array(new_encoded_packages)


async def pcap_file_to_dataset(*, pcap_file_path, pcap_files_count):
    package_label = pcap_file_path.split("/")[-1].split(".")[0]

    read_package = await read_pcap(pcap_path=pcap_file_path)

    if len(read_package) != 0:
        # Encoded data to format 0 - 1
        encoded_model = await encoded_embedding_model(input_length=pcap_files_count * 8)
        encoded_packages = encoded_model.predict(read_package, verbose=0)

        # Change 0 to mean value of column
        means = np.nanmean(encoded_packages, axis=(0, 2))
        encoded_packages[encoded_packages == 0] = np.nan
        encoded_packages = np.nan_to_num(encoded_packages, nan=means)

        # Add expand
        new_encoded_packages = await expand_dimension(encoded_packages=encoded_packages)

        return new_encoded_packages, package_label
    else:
        return [], []


async def array_split(
        *,
        data,
        labels,
        train_size=None,
        test_size=None,
):
    data_array_length = len(data)
    metrics_array_length = len(labels)

    if data_array_length == metrics_array_length:
        split_index = int(data_array_length * (train_size or test_size))

        data_test, data_train = data[:split_index], data[split_index:]
        labels_test_first_part, labels_train_second_part = labels[:split_index], labels[split_index:]

        labels_test_first_part = np.array(labels_test_first_part)
        labels_train_second_part = np.array(labels_train_second_part)

        data_test_max_length = max(len(lst) for lst in data_test)
        data_train_max_length = max(len(lst) for lst in data_train)

        data_test = np.array(
            [np.concatenate(
                (lst, np.zeros([int(data_test_max_length - len(lst)), 8, 8, 1]))
            ) for lst in data_test]
        )

        data_train = np.array(
            [np.concatenate(
                (lst, np.zeros([int(data_train_max_length - len(lst)), 8, 8, 1]))
            ) for lst in data_train]
        )

        mean_value_test = np.mean(data_test, axis=(0, 1, 2, 3))
        data_test[data_test == 0] = mean_value_test

        mean_value_test = np.mean(data_train, axis=(0, 1, 2, 3))
        data_train[data_train == 0] = mean_value_test

        return ((data_test, labels_test_first_part),
                (data_train, labels_train_second_part))
