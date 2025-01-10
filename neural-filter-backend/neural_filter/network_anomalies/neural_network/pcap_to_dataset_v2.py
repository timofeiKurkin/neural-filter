import ipaddress
import numpy as np

from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from scapy.all import PcapReader
from tqdm import tqdm

image_of_package_size = 8


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
            # ip_ttl = package_data['IP'].ttl
            # ip_chksum = package_data['IP'].chksum
            ip_len = package_data['IP'].len
            ip_proto = package_data['IP'].proto

            # TCP layer
            tcp_sport = package_data['TCP'].sport
            tcp_dport = package_data['TCP'].dport
            # tcp_chksum = package_data['TCP'].chksum
            # tcp_window = package_data['TCP'].window

            package_ = np.array([
                mac_dst,
                mac_src,
                ip_len,
                ip_proto,
                ip_src,
                ip_dst,
                tcp_sport,
                tcp_dport,

                # ip_ttl,
                # ip_chksum,
                # tcp_window,
                # tcp_chksum
            ])

            package_array = np.append(package_array, package_)

        if len(package_array) == image_of_package_size:
            packages_list.add(tuple(package_array))

    packages_list = np.array(list(packages_list))

    if len(packages_list) > 0:
        return packages_list, package_label
    else:
        return []


async def expand_dimension(*, encoded_packages):
    new_encoded_packages = []

    print("")
    print("==== Expanding dimension ====")
    for packages in tqdm(encoded_packages):
        package_data = np.array([[np.expand_dims(package_item, axis=0) for package_item in package]
                                 for package in packages])
        new_encoded_packages.append(package_data)

    return np.array(new_encoded_packages)


async def formatted_package(*, ip_addresses, mac_addresses):
    ip_addresses_encoded = [int(ipaddress.IPv4Address(ip)) / 100 for ip in ip_addresses]
    mac_addresses_encoded = [int(mac_address.replace(":", ""), 16) / 10000000 for mac_address in mac_addresses]

    return ip_addresses_encoded, mac_addresses_encoded


async def formatted_packages(
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

    print("")
    print("==== Converting dataset to images ====")

    for session in tqdm(packages):
        images = []

        for idx, package in enumerate(session):
            if len(session) == 1:
                zeros = np.tile(np.zeros((image_of_package_size, 1)), (image_of_package_size - 1, 1, 1))
                only = np.concatenate(([package], zeros))
                images.append(only)

            if len(images):
                if idx != len(session) - 1:
                    if len(images[-1]) < image_of_package_size:
                        images[-1].append(package)
                    else:
                        images.append([package])
                else:
                    lack = image_of_package_size - len(images[-1])
                    if lack:
                        zeros = np.tile(np.zeros((image_of_package_size, 1)), ((lack - 1), 1, 1))
                        last = np.concatenate(([package], zeros))
                        images[-1].extend(last)
                    else:
                        zeros = np.tile(np.zeros((image_of_package_size, 1)), (image_of_package_size - 1, 1, 1))
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
        test_size=0.2,
):
    data_array_length = len(data)
    metrics_array_length = len(labels)

    if data_array_length == metrics_array_length:
        split_index = int(data_array_length * test_size)

        data_test = data[:split_index]
        labels_test_first_part = labels[:split_index]

        # data_test[data_test == 0] = np.mean(data_test, axis=(0, 1, 2, 3))
        # data_train[data_train == 0] = np.mean(data_train, axis=(0, 1, 2, 3))

        return (
            (data, labels),
            (data_test, labels_test_first_part)
        )
