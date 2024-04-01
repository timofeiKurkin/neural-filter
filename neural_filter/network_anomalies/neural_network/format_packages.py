import pandas as pd
import numpy as np

from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from sklearn.model_selection import train_test_split


async def format_packages(*, packages: list[dict]):
    # Распаковываю протоколы и длины пакетов в два соответствующих массива
    protocols = [packet["protocol"] for packet in packages]
    lengths = [packet["length"] for packet in packages]

    # Создаю двухмерных массив, где каждая строчка - единичный пакет/длина пакета в массиве
    protocols = np.array(protocols).reshape(-1, 1)
    lengths = np.array(lengths).reshape(-1, 1)

    # Масштабирую протоколы и длины пакетов в значения от 0 до 1.
    # Ip адреса масштабирую другим способом, т.к. MinMaxScaler работает только с числами.
    scaler = MinMaxScaler()

    # .fit_transform - масштабирует значения от 0 до 1,
    # исходя из минимального и максимального значения в protocols/lengths
    protocols_normalized = scaler.fit_transform(protocols)
    lengths_normalized = scaler.fit_transform(lengths)

    # Заменяю предыдущие значения в исходном массиве пакетов на новые
    for i in range(len(packages)):
        packages[i]["protocol"] = protocols_normalized[i][0]
        packages[i]["length"] = lengths_normalized[i][0]

    # Из-за того, что MinMaxScaler не может работать со строками, ip адреса прийдется обработать другим способом
    df = pd.DataFrame(packages)

    # Кодирование ip адресов происходит через
    encoder = OneHotEncoder(sparse_output=False, drop="first")
    ip_encoded = encoder.fit_transform(df[["source", "destination"]])

    # Добавить ip адреса обратно в DataFrame
    df_encoded = pd.concat(
        [
            df,
            pd.DataFrame(
                ip_encoded,
                columns=encoder.get_feature_names_out(["source", "destination"])
            )
        ],
        axis=1)

    # Удаляем исходные столбцы с source, destination и time
    df_encoded = df_encoded.drop(["source", "destination", "time", "id"], axis=1)

    print("in format_packages.py", df_encoded.values[0])
    print(f"{df_encoded=}")
    return df_encoded.values
