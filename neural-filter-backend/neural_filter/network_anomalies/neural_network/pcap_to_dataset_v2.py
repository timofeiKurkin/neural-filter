import ipaddress

import numpy as np
from scapy.all import PcapReader
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from tqdm import tqdm

from .packets_validation import is_valid_packet

image_of_package_size = 8


# def build_packet(
#     *,
#     ip_src: float,
#     ip_dst: float,
#     mac_src: float,
#     mac_dst: float,
#     ip_len: float,
#     ip_proto: float,
#     sport: float,
#     dport: float,
# ) -> List[float]:
#     return [ip_src, ip_dst, mac_src, mac_dst, ip_len, ip_proto, sport, dport][
#         :image_of_package_size
#     ]

k = 2**32
t = 2**48


async def read_pcap(*, pcap_path):
    packets = PcapReader(pcap_path)
    packages_list = set()
    package_label = pcap_path.split("/")[-1].split(".")[0]

    max_count = 65535

    for packet in packets:
        package_array = np.array([])

        if not is_valid_packet(packet=packet):
            continue

        # Header
        mac_src: float = int(packet.src.replace(":", ""), 16) / t
        mac_dst: float = int(packet.dst.replace(":", ""), 16) / t

        # IP layer
        ip_src: float = int(ipaddress.IPv4Address(packet["IP"].src)) / k
        ip_dst: float = int(ipaddress.IPv4Address(packet["IP"].dst)) / k

        ip_len: float = packet["IP"].len / max_count
        ip_proto: float = packet["IP"].proto / 255.0

        # Ports
        sport: float = packet.sport / max_count if hasattr(packet, "sport") else 0
        dport: float = packet.dport / max_count if hasattr(packet, "dport") else 0

        package_ = np.array(
            [
                mac_dst,
                mac_src,
                ip_len,
                ip_proto,
                ip_src,
                ip_dst,
                sport,
                dport,
            ]
        )
        package_array = np.append(package_array, package_)

        packages_list.add(tuple(package_array))

    packages_list = np.array(list(packages_list))

    return packages_list, package_label


async def expand_dimension(*, encoded_packages):
    new_encoded_packages = []

    print("")
    print("==== Expanding dimension ====")
    for packages in tqdm(encoded_packages):
        package_data = np.array(
            [
                [np.expand_dims(package_item, axis=0) for package_item in package]
                for package in packages
            ]
        )
        new_encoded_packages.append(package_data)

    return np.array(new_encoded_packages)


async def format_packet(*, ip_addresses, mac_addresses):
    k = 2**32
    ip_addresses_encoded = [int(ipaddress.IPv4Address(ip)) / k for ip in ip_addresses]
    mac_addresses_encoded = [
        int(mac_address.replace(":", ""), 16) / t for mac_address in mac_addresses
    ]

    return ip_addresses_encoded, mac_addresses_encoded


async def format_packets(*, packages, labels=None):
    if labels is not None:
        label_encoded = LabelEncoder()
        label_encoded.fit(labels)
        labels = label_encoded.transform(labels)

        mms = MinMaxScaler(feature_range=(0, 1))
        mms.fit(labels.reshape(-1, 1))  # type: ignore
        labels = mms.transform(labels.reshape(-1, 1))  # type: ignore

    assert labels is not None
    new_arr = []

    print("")
    print("==== Converting dataset to images ====")

    for session in tqdm(packages):
        images = []

        for idx, package in enumerate(session):
            if len(session) == 1:
                zeros = np.tile(
                    np.zeros((image_of_package_size, 1)),
                    (image_of_package_size - 1, 1, 1),
                )
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
                        zeros = np.tile(
                            np.zeros((image_of_package_size, 1)), ((lack - 1), 1, 1)
                        )
                        last = np.concatenate(([package], zeros))
                        images[-1].extend(last)
                    else:
                        zeros = np.tile(
                            np.zeros((image_of_package_size, 1)),
                            (image_of_package_size - 1, 1, 1),
                        )
                        last = np.concatenate(([package], zeros))
                        images.append(last)
            else:
                images.append([package])

        images = np.array(images)
        new_arr.append(images)

    new_arr = np.array(new_arr)

    return new_arr, labels


async def split_dataset(
    *,
    data: np.ndarray,
    labels: np.ndarray,
    test_size: float = 0.2,
):
    split_index = int(len(data) * test_size)
    data_test = data[:split_index]
    labels_test_first_part = labels[:split_index]
    return (data, labels), (data_test, labels_test_first_part)
