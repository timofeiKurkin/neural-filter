# File where will be neural network for scanning network

# from sklearn.model_selection import train_test_split
#
#
# # Достаю значения пакетов после их нормализации
# features = []  # df_encoded.values
#
# # Разделяю данные на обучающие (тренировочные) и тестовые
# X_train, X_test = train_test_split(features, test_size=0.2, random_state=42)
#
# # Формирую модель, где каждая следующая переменная = слой
# # Входящий слой, который принимает данные
# input_layer = Input(shape=(X_train.shape[1],))
#
# encoded_layer = Dense(128, activation="relu")(input_layer)
# encoded_layer_two = Dense(62, activation="relu")(encoded_layer)
# decoded_layer = Dense(128, activation="relu")(encoded_layer_two)
# dropout_layer = Dropout(0.2)(decoded_layer)
# output_layer = Dense(X_train.shape[1], activation="softmax")(dropout_layer)
#
# model = Model(inputs=input_layer, outputs=output_layer)
#
# model.compile(optimizer=Adam(learning_rate=0.001), loss="mse", metrics=["accuracy"])
# model.save("neural-network-for-work.keras", overwrite=True)
