import ipaddress
import json
import os
import random

import numpy as np
import keras
# import matplotlib.pyplot as plt
# import matplotlib.colors as mcolors
# import matplotlib as mpl
from pathlib import Path
from scapy.all import PcapReader
from sklearn.preprocessing import LabelEncoder

BASE_DIR = Path(__file__).resolve().parent.parent


def read_pcap(*, pcap_path):
    packages = PcapReader(pcap_path)
    packages_list = set()

    for package_data in packages:
        package_array = np.array([])

        if (
                "IP" in package_data and
                ("TCP" in package_data or
                 "UDP" in package_data)
        ):
            if "IP" in package_data:
                package_array = np.append(package_array, [
                    package_data['IP'].src,
                    package_data['IP'].dst,
                    package_data['IP'].proto,
                    package_data['IP'].len,
                ])
            else:
                package_array = np.append(package_array, [
                    "127.0.0.1",
                    "127.0.0.1",
                    2,
                    random.choice(range(1, 3000)),
                ])

            if "TCP" in package_data:
                package_array = np.append(package_array, sorted([
                    package_data['TCP'].sport or 0,
                    package_data['TCP'].dport or 0,
                ]))
            elif "UDP" in package_data:
                package_array = np.append(package_array, sorted([
                    package_data['UDP'].sport or 0,
                    package_data['UDP'].dport or 0,
                ]))
            else:
                package_array = np.append(package_array, np.random.randint(0, 65536, size=2))

        if len(package_array) == 6:
            packages_list.add(tuple(package_array))

    if len(packages_list) != 0:
        return np.array(list(packages_list))


def pcap_files_to_dataset(*, pcap_files_path):
    # dataset_packages = np.array([])
    # dataset_labels = np.array([])

    dataset_packages = []
    dataset_labels = []

    # index = 0

    for pcap_file in pcap_files_path:
        packages, label = pcap_file_to_dataset(pcap_file_path=pcap_file)

        # if dataset_packages.size == 0 or dataset_labels.size == 0:
        #     if dataset_packages.size == 0:
        #         dataset_packages = packages
        #     if dataset_labels.size == 0:
        #         dataset_labels = label
        # else:
        #     dataset_packages = np.vstack([dataset_packages, packages])
        #     dataset_labels = np.vstack([dataset_labels, label])

        # dataset_packages = np.vstack([dataset_packages, packages])
        # dataset_labels = np.vstack([dataset_labels, label])

        if len(packages) != 0 and len(label) != 0:
            dataset_packages.append(packages)
            dataset_labels.append(label)

        # index += 1
        # if index == 1:
        #     break

    return dataset_packages, dataset_labels


def formated_packages(*, package):
    encoded_package = []

    for pack in package:
        ip_src, ip_dst, ip_proto, ip_len, port_src, port_dst = pack

        encoded_ip_addresses = (
            np.array([np.log(int(ipaddress.IPv4Address(ip))) for ip in (ip_src, ip_dst)])
        )
        other_data_int = (
            np.array([int(data) for data in (ip_proto, ip_len, port_src, port_dst)])
        )
        combined_array = (
            np.concatenate([encoded_ip_addresses, other_data_int])
        )

        if len(encoded_package) == 0:
            encoded_package.append(combined_array)
        else:
            encoded_package.append(combined_array)

    encoded_package = np.array(encoded_package)

    return encoded_package


def put_label_on_packages(*, packages, label):
    return packages, label
    # return packages, np.array([label])


def encoded_data(*, input_length):
    encoded_model = keras.Sequential([
        keras.layers.Embedding(
            input_dim=input_length+1,
            output_dim=6,
        )
    ])
    encoded_model.compile(
        optimizer=keras.optimizers.Adam(),
        loss=keras.losses.MeanSquaredError()
    )
    return encoded_model


def pcap_file_to_dataset(*, pcap_file_path):
    package_label = pcap_file_path.split(".")[2:3][0]

    read_package = read_pcap(pcap_path=pcap_file_path)

    if read_package is not None:
        transformed_packages = formated_packages(package=read_package)

        encoded_model = encoded_data(input_length=len(read_package))
        encoded_packages = encoded_model.predict(transformed_packages)

        new_encoded_packages = []

        for packages in encoded_packages:
            package_data = [[np.expand_dims(package_item, axis=0) for package_item in package]
                            for package in packages]
            new_encoded_packages.append(np.array(package_data))

        new_encoded_packages = np.array(new_encoded_packages)

        # print(new_encoded_packages)

        packages, label = put_label_on_packages(
            packages=new_encoded_packages,
            label=package_label
        )

        return packages, label
    else:
        return [], []


def array_split(
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

        # print(data_test.shape)
        # print(data_train.shape)

        # print(np.array([zero_package] * 3).shape)
        # print(data_test[0].shape)
        # print(np.concatenate((
        #     data_test[1], np.array([zero_package] * 3)
        # )).shape)

        # data_test = np.array([
        #     np.expand_dims(package, axis=0) for file_package in data_test for package in file_package
        # ])
        # data_train = np.array([
        #     np.expand_dims(package, axis=0) for file_package in data_train for package in file_package
        # ])

        # data_test = np.array([package for file_package in data_test_first_part for package in file_package])
        # data_train = np.array([package for item in data_train_second_part for package in item])

        # metrics_test_part = np.hstack([[label] * len(data_test[idx])
        #                                for idx, label in enumerate(labels_test_first_part)])
        # metrics_train_part = np.hstack([[label] * len(data_train[idx])
        #                                 for idx, label in enumerate(labels_train_second_part)])

        return ((data_test, labels_test_first_part),
                (data_train, labels_train_second_part))
        # return (data_test, metrics_test_part), (data_train, metrics_train_part)


packages_files = BASE_DIR / "new_nn/pcap-sessions-traffic-795k"
pcap_files = [os.path.join(packages_files, package_file) for package_file in os.listdir(packages_files)]

full_dataset_list, full_labels_list = pcap_files_to_dataset(pcap_files_path=pcap_files)

if len(full_dataset_list) != 0 and len(full_labels_list) != 0:
    (X_train, y_train), (X_test, y_test) = array_split(
        data=full_dataset_list,
        labels=full_labels_list,
        train_size=0.8
    )

    label_encoded = LabelEncoder()
    y_train = label_encoded.fit_transform(y_train)
    y_test = label_encoded.fit_transform(y_test)

    print(X_train.shape)
    print(y_train.shape)
    print(X_test.shape)
    print(y_test.shape)

    # y_train = np.array([np.tile([label], (6, 6)) for label in y_train])
    # y_test = np.array([np.tile([label], (6, 6)) for label in y_test])
    # y_train = np.array([[label] * 6 for label in y_train])
    # y_test = np.array([[label] * 6 for label in y_test])

    dataset_for_save = {
        "X_train": X_train,
        "y_train": y_train,
        "X_test": X_test,
        "y_test": y_test
    }

    np.savez(f"{BASE_DIR / 'new_nn' / 'dataset'}.npz", **dataset_for_save)
