import os
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder

import numpy as np
import keras
from pathlib import Path
from scapy.all import PcapReader

BASE_DIR = Path(__file__).resolve().parent.parent


# Модель переводит значения в вид:
# [[[-0.00890877]
#   [-0.02840066]
#   [-0.04574993]
#   [ 0.04079523]
#   [-0.03480418]
#   [-0.03480418]]
#
#  [[-0.02840066]
#   [-0.00890877]
#   [-0.04574993]
#   [ 0.04165996]
#   [-0.03480418]
#   [-0.03480418]] ... далее массивы]
#   input_dim=6 - 6 элементов в каждом массиве
#   output_dim=1 - 1 элемент в каждый массив из 6

# # Max and min value
# max_feature_value, min_feature_value = encoded_packages.max(), encoded_packages.min()
# if index_pro == 0:
#     def custom_cmap(
#             feature_value,
#     ):
#         pixel_value = ((feature_value - min_feature_value) * 255) / (max_feature_value - min_feature_value)
#         return pixel_value
#
#     def show_pcap_file_image(*, data):
#         custom_colors = np.vectorize(custom_cmap)
#         colored_data = custom_colors(data[0])
#
#         viridis_big = mpl.colormaps['viridis'].resampled(256)
#         newcmp = mcolors.ListedColormap(viridis_big(np.linspace(0, 1, 256)))
#
#         plt.figure(figsize=(0.06, 0.06))
#         # plt.subplots_adjust(top=0.92, bottom=0.08, left=0.07, right=.95)
#
#         plt.imshow(colored_data, cmap=newcmp)
#         plt.axis("off")
#         plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
#         plt.show()
#
#     show_pcap_file_image(data=encoded_packages)


def encoded_data(*, input_length):
    encoded_model = keras.Sequential([
        keras.layers.Embedding(
            input_dim=input_length + 7,
            output_dim=6,
        )
    ])
    encoded_model.compile(
        optimizer=keras.optimizers.Adam(),
        loss=keras.losses.MeanSquaredError()
    )
    return encoded_model


def read_pcap(*, pcap_path):
    packages = PcapReader(pcap_path)
    packages_list = set()

    for package_data in packages:
        # print(package_data.show())
        # print(package_data.fields)
        # print("---")
        # print("IP: ")
        # print("package_data['IP'].show(): ", package_data["IP"].show())
        # print("package_data['IP'].fields: ", package_data["IP"].fields)
        # print("---")
        # print("TCP: ")
        # print("package_data['TCP'].show(): ", package_data["TCP"].show())
        # print("package_data['TCP'].fields: ", package_data["TCP"].fields)

        # package_object = {
        #     "source_ip": package_data['IP'].src,
        #     "source_port": package_data['TCP'].sport,
        #
        #     "proto": package_data['IP'].proto,
        #     "length": package_data['IP'].len,
        #
        #     "destination_ip": package_data['IP'].dst,
        #     "destination_port": package_data['TCP'].dport,
        # }
        # packages_list.append([package_object])

        # print(f"{package_data=}")
        # print("======")

        package_array = np.array([])

        if (
                "IP" in package_data or
                "TCP" in package_data or
                "UDP" in package_data
        ):
            if "IP" in package_data:
                package_array = np.append(package_array, [
                    package_data['IP'].src,
                    package_data['IP'].dst,
                    package_data['IP'].proto,
                    package_data['IP'].len,
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

        packages_list.add(tuple(package_array))

    return np.array(list(packages_list))


def formated_packages(*, package):
    unique_ips_ports = set(
        [
            item for sublist in package for item in sublist if isinstance(item, str) or isinstance(item, int)
        ])
    ip_port_to_index = {ip_port: index for index, ip_port in enumerate(unique_ips_ports)}

    return np.array([[ip_port_to_index[item] for item in sublist] for sublist in package])


def pcap_files_to_dataset(*, pcap_files_path):
    dataset_packages = np.array([])
    dataset_labels = np.array([])

    for pcap_file in pcap_files_path:
        packages, label = pcap_file_to_dataset(pcap_file_path=pcap_file)

        if dataset_packages.size == 0:
            dataset_packages = packages
        if dataset_labels.size == 0:
            dataset_labels = label

        dataset_packages = np.concatenate([dataset_packages, packages])
        dataset_labels = np.concatenate([dataset_labels, label])

    return dataset_packages, dataset_labels


def put_label_on_packages(*, packages, label):
    return packages, np.array([label] * len(packages))


def pcap_file_to_dataset(*, pcap_file_path):
    package_label = pcap_file_path.split(".")[2:3][0]
    read_package = read_pcap(
        pcap_path=pcap_file_path,
    )
    transformed_packages = formated_packages(
        package=read_package
    )
    encoded_model = encoded_data(
        input_length=len(read_package)
    )
    encoded_packages = encoded_model.predict(tf.constant(transformed_packages))

    packages, label = put_label_on_packages(
        packages=encoded_packages,
        label=package_label
    )

    return packages, label


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

        data_test_part, data_train_part = np.split(data, [split_index])
        metrics_test_part, metrics_train_part = np.split(labels, [split_index])

        return (data_test_part, metrics_test_part), (data_train_part, metrics_train_part)


packages_files = BASE_DIR / "new_nn/MyPackages3Sessions"
pcap_files = [os.path.join(packages_files, package_file) for package_file in os.listdir(packages_files)]

full_dataset_list, full_labels_list = pcap_files_to_dataset(pcap_files_path=pcap_files)
(X_train, y_train), (X_test, y_test) = array_split(
    data=full_dataset_list,
    labels=full_labels_list,
    train_size=0.8
)

label_encoded = LabelEncoder()
encoded_y_train = label_encoded.fit_transform(y_train)
encoded_y_test = label_encoded.fit_transform(y_test)

# print(keras.utils.to_categorical(encoded_y_train, 3))

# print(X_train.shape)
# print(encoded_y_train.shape)
# print("====")
# print(X_test.shape)
# print(encoded_y_test.shape)

model = keras.Sequential([
    keras.layers.LSTM(
        units=36,
        return_sequences=True,
        stateful=False,
        # activation="tanh",
        # recurrent_activation="sigmoid",
        # use_bias=True,
        # kernel_initializer="glorot_uniform",
        # recurrent_initializer="orthogonal",
        # bias_initializer="zeros",
        # unit_forget_bias=True,
        # kernel_regularizer=None,
        # recurrent_regularizer=None,
        # bias_regularizer=None,
        # activity_regularizer=None,
        # kernel_constraint=None,
        # recurrent_constraint=None,
        # bias_constraint=None,
        # dropout=0.0,
        # recurrent_dropout=0.0,
        # seed=None,
        # return_sequences=False,
        # return_state=False,
        # go_backwards=False,
        # stateful=False,
        # unroll=False,
        # input_shape=X_train.shape
        # use_cudnn="auto",
    ),
    # keras.layers.Dense(units=2, activation="softmax"),
])

model.compile(
    # optimizer=keras.optimizers.Adam(learning_rate=1e-3),
    # loss=keras.losses.MeanSquaredError,
    optimizer=keras.optimizers.Adam(learning_rate=1e-3),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)
model.summary()

model.fit(
    x=X_train,
    y=encoded_y_train,
    epochs=10,
    batch_size=32,
    validation_data=(X_test, encoded_y_test)
)
