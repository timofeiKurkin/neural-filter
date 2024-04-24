import keras
import keras_cv
import numpy as np
import tensorflow as tf

from sklearn.preprocessing import MinMaxScaler

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


async def encoded_data(*, input_length):
    encoded_model = keras.Sequential([
        keras.layers.Embedding(
            input_dim=input_length + 1,
            output_dim=1,
        ),
        keras.layers.Dense(units=1, activation='relu')
    ])
    encoded_model.compile(
        optimizer=keras.optimizers.Adam(),
        loss=keras.losses.MeanSquaredError()
    )
    return encoded_model


async def classification_traffic_nn(
        *,
        dataset,
        save_model_path
):
    if dataset:
        (X_train, y_train), (X_test, y_test) = (
            (dataset["X_train"], dataset["y_train"]),
            (dataset["X_test"], dataset["y_test"]))

        model = keras.Sequential([
            keras.layers.ConvLSTM2D(
                filters=32,
                kernel_size=3,
                activation=keras.activations.leaky_relu,
                input_shape=X_train.shape[1:],
                return_sequences=False,
                name="ConvLSTM"
            ),
            # keras_cv.layers.SqueezeAndExcite2D(filters=32, name="SqueezeAndExcite1"),
            keras.layers.Conv2D(
                filters=64,
                kernel_size=3,
                activation=keras.activations.leaky_relu,
                padding="same",
                name="Conv2"
            ),
            # keras_cv.layers.SqueezeAndExcite2D(filters=64, name="SqueezeAndExcite2"),
            keras.layers.Conv2D(
                filters=64,
                kernel_size=3,
                activation=keras.activations.leaky_relu,
                padding="same",
                name="Conv3"
            ),
            # keras_cv.layers.SqueezeAndExcite2D(filters=64, name="SqueezeAndExcite3"),
            keras.layers.MaxPooling2D(pool_size=(2, 2)),

            keras_cv.layers.SqueezeAndExcite2D(filters=64, name="SqueezeAndExcite"),

            keras.layers.Conv2D(
                filters=32,
                kernel_size=3,
                activation=keras.activations.leaky_relu,
                padding="same",
                name="Conv4"
            ),
            # keras_cv.layers.SqueezeAndExcite2D(filters=32, name="SqueezeAndExcite4"),
            keras.layers.Conv2D(
                filters=32,
                kernel_size=3,
                activation=keras.activations.leaky_relu,
                padding="same",
                name="Conv5"
            ),
            # keras_cv.layers.SqueezeAndExcite2D(filters=32, name="SqueezeAndExcite5"),
            keras.layers.Conv2D(
                filters=16,
                kernel_size=3,
                activation=keras.activations.leaky_relu,
                padding="same",
                name="Conv6"
            ),
            # keras_cv.layers.SqueezeAndExcite2D(filters=16, name="SqueezeAndExcite6"),
            keras.layers.MaxPooling2D(pool_size=(2, 2)),

            keras.layers.BatchNormalization(),
            keras.layers.Dropout(0.2),
            keras.layers.Flatten(),
            keras.layers.Dense(
                units=1024,
                activation=keras.activations.leaky_relu
            ),
            keras.layers.Dense(
                units=1,
                activation=keras.activations.sigmoid
            ),
        ], name="traffic_classification")

        adam = keras.optimizers.Adam(learning_rate=0.001)
        model.compile(
            optimizer=adam,
            # loss=keras.losses.binary_crossentropy,
            loss=keras.losses.BinaryCrossentropy(),
            metrics=[
                'recall',
                'precision'
            ]
        )

        model.summary()

        epochs = 30

        history = model.fit(
            x=X_train,
            y=y_train,
            epochs=epochs,
            batch_size=32,
            validation_data=(X_test, y_test),
            # validation_freq=[1, 5, 10]
        )

        predictions = model.predict(
            x=X_test,
            batch_size=32
        )
        print(f"{predictions=}")
        print(f"{predictions.shape=}")

        model.save(save_model_path)
        print(f"Model saved successfully to: {save_model_path}")

        return {
            "model": model,
            "history": history,
            "epochs": epochs
        }
