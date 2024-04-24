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
                "IP" in package_data and
                ("TCP" in package_data or
                 "UDP" in package_data)
        ):
            package_array = np.append(package_array, [
                package_data['IP'].src,
                package_data['TCP'].sport if package_data.haslayer("TCP") else package_data['UDP'].sport,
                package_data['IP'].dst,
                package_data['TCP'].dport if package_data.haslayer("TCP") else package_data['UDP'].dport,
                package_data['IP'].proto,
                package_data['IP'].len,
            ])

        if len(package_array) == 6:
            packages_list.add(tuple(package_array))

    if len(packages_list) != 0:
        return np.array(list(packages_list))


# async def pcap_files_to_dataset(*, pcap_files_path):
#     dataset_packages = []
#     dataset_labels = []
#
#     for pcap_file in pcap_files_path:
#         packages, label = await pcap_file_to_dataset(pcap_file_path=pcap_file)
#
#         if len(packages) != 0 and len(label) != 0:
#             dataset_packages.append(packages)
#             dataset_labels.append(label)
#
#     return dataset_packages, dataset_labels


async def formated_packages(*, package):
    encoded_package = []

    for pack in package:
        ip_src, port_src, ip_dst, port_dst, ip_proto, ip_len = pack

        encoded_ip_addresses = (
            np.array([int(ipaddress.IPv4Address(ip)) for ip in (ip_src, ip_dst)])
        )
        other_data_int = (
            np.array([int(data) for data in (ip_proto, ip_len, port_src, port_dst)])
        )
        combined_array = (
            np.concatenate([encoded_ip_addresses, other_data_int])
        )

        mms = MinMaxScaler(feature_range=(0, 1))
        encoded_test = mms.fit_transform(combined_array.reshape(-1, 1))
        encoded_test = encoded_test.reshape(1, -1)[0]

        # combined_array = np.array([np.expand_dims(x, axis=0) for x in combined_array])

        encoded_package.append(combined_array)

    encoded_package = np.array(encoded_package)

    # mms = MinMaxScaler(feature_range=(0, 1))
    # mms.fit(encoded_package)
    # encoded_test = mms.fit_transform(encoded_package)
    # print(f"{encoded_package=}")
    # print(f"{encoded_test=}")

    return encoded_package


async def put_label_on_packages(*, packages, label):
    return packages, label
    # return packages, np.array([label])


async def encoded_embedding_model(*, input_length):
    encoded_model = keras.Sequential([
        keras.layers.Embedding(
            input_dim=input_length+1,
            output_dim=6,
        ),
        keras.layers.Dense(units=6, activation=keras.activations.leaky_relu),
    ])
    encoded_model.compile(
        optimizer=keras.optimizers.Adam(),
        loss=keras.losses.MeanSquaredError()
    )
    return encoded_model


async def expand_dimension(*, encoded_packages):
    new_encoded_packages = []

    for packages in encoded_packages:
        package_data = [[np.expand_dims(package_item, axis=0) for package_item in package]
                        for package in packages]
        new_encoded_packages.append(np.array(package_data))

    return np.array(new_encoded_packages)


async def pcap_file_to_dataset(*, pcap_file_path):
    package_label = pcap_file_path.split("/")[-1].split(".")[0]

    read_package = await read_pcap(pcap_path=pcap_file_path)

    if read_package is not None:
        transformed_packages = await formated_packages(package=read_package)

        encoded_model = await encoded_embedding_model(input_length=len(read_package))
        # encoded_model.fit(x=transformed_packages, y=package_label)
        encoded_packages = encoded_model.predict(transformed_packages)

        new_encoded_packages = await expand_dimension(encoded_packages=encoded_packages)

        packages, label = await put_label_on_packages(
            packages=new_encoded_packages,
            label=package_label
        )

        return packages, label
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
                (lst, np.zeros([int(data_test_max_length - len(lst)), 6, 6, 1]))
            ) for lst in data_test]
        )

        data_train = np.array(
            [np.concatenate(
                (lst, np.zeros([int(data_train_max_length - len(lst)), 6, 6, 1]))
            ) for lst in data_train]
        )

        return ((data_test, labels_test_first_part),
                (data_train, labels_train_second_part))
