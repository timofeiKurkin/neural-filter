import ipaddress
import numpy as np

from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from scapy.all import PcapReader


async def read_pcap(*, pcap_path):
    packages = PcapReader(pcap_path)
    packages_list = set()
    package_label = pcap_path.split("/")[-1].split(".")[0]

    for package_data in packages:
        package_array = np.array([])

        if (
                package_data.haslayer("IP") and package_data.haslayer("TCP")
        ):
            # Header
            mac_dst = int(package_data.fields["dst"].replace(":", ""), 16) / 10000000
            mac_src = int(package_data.fields["src"].replace(":", ""), 16) / 10000000

            # IP layer
            ip_src = int(ipaddress.IPv4Address(package_data['IP'].src)) / 100
            ip_dst = int(ipaddress.IPv4Address(package_data['IP'].dst)) / 100
            ip_len = package_data['IP'].len
            ip_proto = package_data['IP'].proto

            # TCP layer
            tcp_sport = package_data['TCP'].sport
            tcp_dport = package_data['TCP'].dport

            package_ = np.array([
                mac_dst,
                mac_src,
                ip_len,
                ip_proto,
                ip_src,
                ip_dst,
                tcp_sport,
                tcp_dport,
            ])

            package_array = np.append(package_array, package_)

        if len(package_array) == 8:
            packages_list.add(tuple(package_array))

    packages_list = np.array(list(packages_list))

    if len(packages_list) > 0:
        return packages_list, package_label
    else:
        return []


async def expand_dimension(*, encoded_packages):
    new_encoded_packages = []

    for packages in encoded_packages:
        package_data = np.array([[np.expand_dims(package_item, axis=0) for package_item in package]
                                 for package in packages])
        new_encoded_packages.append(package_data)

    return np.array(new_encoded_packages)


async def formated_packages(
        *,
        packages,
        labels=None
):
    if labels is not None:
        label_encoded = LabelEncoder()
        label_encoded.fit(labels)
        labels = label_encoded.transform(labels)

        mms = MinMaxScaler(feature_range=(0, 1))
        mms.fit(labels.reshape(-1, 1))
        labels = mms.transform(labels.reshape(-1, 1))

    new_arr = []

    for session in packages:
        images = []

        for idx, package in enumerate(session):
            if len(session) == 1:
                zeros = np.tile(np.zeros((8, 1)), (7, 1, 1))
                only = np.concatenate(([package], zeros))
                images.append(only)

            if len(images):
                if idx != len(session) - 1:
                    if len(images[-1]) < 8:
                        images[-1].append(package)
                    else:
                        images.append([package])
                else:
                    lack = 8 - len(images[-1])
                    if lack:
                        zeros = np.tile(np.zeros((8, 1)), ((lack - 1), 1, 1))
                        last = np.concatenate(([package], zeros))
                        images[-1].extend(last)
                    else:
                        zeros = np.tile(np.zeros((8, 1)), (7, 1, 1))
                        last = np.concatenate(([package], zeros))
                        images.append(last)
            else:
                images.append([package])

        images = np.array(images)
        new_arr.append(images)

    new_arr = np.array(new_arr)

    return new_arr, labels


async def dataset_split(
        *,
        data,
        labels,
        train_size=0.8,
        test_size=0.2,
):
    data_array_length = len(data)
    metrics_array_length = len(labels)

    if data_array_length == metrics_array_length:
        split_index = int(data_array_length * (train_size or test_size))

        data_test, data_train = data[:split_index], data[split_index:]
        labels_test_first_part, labels_train_second_part = labels[:split_index], labels[split_index:]

        data_test[data_test == 0] = np.mean(data_test, axis=(0, 1, 2, 3))
        data_train[data_train == 0] = np.mean(data_train, axis=(0, 1, 2, 3))

        return ((data_test, labels_test_first_part),
                (data_train, labels_train_second_part))

