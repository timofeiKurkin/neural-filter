import keras
import keras_cv
import numpy as np
import tensorflow as tf

# from schedule_of_learning_outcomes import schedule_of_learning_outcomes
# from pcap_to_dataset import encoded_data

tf.random.set_seed(0)
np.set_printoptions(suppress=True)


# model = Sequential([
#     LSTM(),
#     Conv2D(1, (32, 28)),
#     Conv2D(1, (64, 28)),
#     Conv2D(1, (64, 28)),
#     MaxPooling2D(),
#
#     Conv2D(1, (32, 14)),
#     Conv2D(1, (32, 14)),
#     Conv2D(1, (16, 14)),
#     MaxPooling2D(),
#
#     Dense(1024, activation='relu'),
#     # Dense(256, activation='relu'),
#     Dense(2, activation='softmax'),
# ])


# async def encoded_data(*, input_length):
#     encoded_model = keras.Sequential([
#         keras.layers.Embedding(
#             input_dim=input_length + 1,
#             output_dim=1,
#         ),
#         keras.layers.Dense(units=1, activation='relu')
#     ])
#     encoded_model.compile(
#         optimizer=keras.optimizers.Adam(),
#         loss=keras.losses.MeanSquaredError()
#     )
#     return encoded_model


async def classification_traffic_nn(
        *,
        X_train,
        y_train,
        X_test,
        y_test,
        save_model_path
):
    if len(X_train) and len(y_train) and len(X_test) and len(y_test):
        # (X_train, y_train), (X_test, y_test) = (
        #     (dataset["X_train"], dataset["y_train"]),
        #     (dataset["X_test"], dataset["y_test"]))
        #
        # print(f"{X_train.shape}")
        # print(f"{y_train.shape}")
        # print(f"{X_test.shape}")
        # print(f"{y_test.shape}")
        # print(X_test)

        model = keras.Sequential([
            keras.layers.ConvLSTM2D(
                filters=16,
                kernel_size=3,
                activation=keras.activations.relu,
                input_shape=X_train.shape[1:],
                return_sequences=False,
                name="ConvLSTM"
            ),
            keras.layers.Conv2D(
                filters=32,
                kernel_size=3,
                activation=keras.activations.relu,
                padding="same",
                name="Conv2"
            ),
            keras.layers.Conv2D(
                filters=32,
                kernel_size=3,
                activation=keras.activations.relu,
                padding="same",
                name="Conv3"
            ),
            keras.layers.MaxPooling2D(pool_size=(2, 2)),

            keras_cv.layers.SqueezeAndExcite2D(filters=32, name="SqueezeAndExcite"),

            keras.layers.Conv2D(
                filters=16,
                kernel_size=3,
                activation=keras.activations.relu,
                padding="same",
                name="Conv4"
            ),
            keras.layers.Conv2D(
                filters=16,
                kernel_size=3,
                activation=keras.activations.relu,
                padding="same",
                name="Conv5"
            ),
            keras.layers.MaxPooling2D(pool_size=(2, 2)),

            keras.layers.BatchNormalization(),
            keras.layers.Dropout(0.2),
            keras.layers.Flatten(),
            keras.layers.Dense(
                units=256,
                activation=keras.activations.relu
            ),
            keras.layers.Dense(
                units=64,
                activation=keras.activations.relu
            ),
            keras.layers.Dense(
                units=1,
                activation=keras.activations.sigmoid
            ),
        ], name="traffic_classification")

        adam = keras.optimizers.Adam(learning_rate=0.001)
        model.compile(
            optimizer=adam,
            loss=keras.losses.BinaryCrossentropy(),
            metrics=[
                keras.metrics.BinaryAccuracy(),
                keras.metrics.Recall(),
                keras.metrics.Precision()
            ]
        )

        model.summary()

        epochs = 50

        history = model.fit(
            x=X_train,
            y=y_train,
            epochs=epochs,
            batch_size=32,
            validation_data=(X_test, y_test),
        )

        predictions = model.predict(
            x=X_test,
            batch_size=32
        )
        print(f"{predictions=}")
        print(f"{predictions.shape=}")
        print(f"{np.max(predictions)=}")
        print(f"{np.min(predictions)=}")

        model.save(save_model_path)
        print(f"Model saved successfully to: {save_model_path}")

        return {
            "model": model,
            "history": history,
            "epochs": epochs
        }
