import json
import numpy as np
import tensorflow as tf
import keras

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


def encoded_data(*, input_length):
    encoded_model = keras.Sequential([
        keras.layers.Embedding(
            input_dim=input_length,
            output_dim=1,
        )
    ])
    encoded_model.compile(
        optimizer=keras.optimizers.Adam(),
        loss=keras.losses.MeanSquaredError()
    )
    return encoded_model


dataset = np.load("dataset.npz")

if dataset:
    (X_train, y_train), (X_test, y_test) = (
        (dataset["X_train"], dataset["y_train"]),
        (dataset["X_test"], dataset["y_test"]))

    # print(y_train[0])
    # print(y_train.shape)
    # print(y_test.shape)

    encoded_train = encoded_data(input_length=len(y_train))
    y_train = encoded_train.predict(tf.constant(y_train))

    encoded_test = encoded_data(input_length=len(y_test))
    y_test = encoded_test.predict(tf.constant(y_test))

    # print(len(X_train))
    # print(X_train[:6])

    model = keras.Sequential([
        keras.layers.ConvLSTM2D(
            filters=32,
            kernel_size=3,
            activation="relu",
            input_shape=X_train.shape[1:],
            return_sequences=False,
            name="ConvLSTM"
        ),

        keras.layers.Conv2D(
            filters=64,
            kernel_size=3,
            activation="relu",
            padding="same",
            name="Conv2"
        ),
        keras.layers.Conv2D(
            filters=64,
            kernel_size=3,
            activation="relu",
            padding="same",
            name="Conv3"
        ),
        keras.layers.MaxPooling2D(padding="same", pool_size=(2, 2)),

        keras.layers.Conv2D(
            filters=32,
            kernel_size=3,
            activation="relu",
            padding="same",
            name="Conv4"
        ),
        keras.layers.Conv2D(
            filters=32,
            kernel_size=3,
            activation="relu",
            padding="same",
            name="Conv5"
        ),
        keras.layers.Conv2D(
            filters=16,
            kernel_size=3,
            activation="relu",
            padding="same",
            name="Conv6"
        ),
        keras.layers.MaxPooling2D(padding="same", pool_size=(2, 2)),

        keras.layers.Flatten(),
        keras.layers.Dense(1024, activation="relu"),
        keras.layers.Dense(1, activation="sigmoid"),
        # keras.layers.Dense(1, activation="sigmoid")
        # keras.layers.Conv2D(
        #     filters=64,
        #     kernel_size=(3, 3),
        #     activation="relu",
        #     name="Conv3"
        # )
    ], name="traffic_classification")

    # model.compile(
    #     optimizer=keras.optimizers.Adam(learning_rate=1e-3),
    #     loss="categorical_crossentropy",
    #     metrics=["accuracy"]
    # )

    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

    model.summary()

    model.fit(
        x=X_train,
        y=y_train,
        epochs=10,
        batch_size=32,
        validation_data=(X_test, y_test)
    )

    predictions = model.predict(
        x=X_test,
        batch_size=32
    )

    prediction_one = model.predict(
        x=np.array([X_train[0]])
    )

    print(f"{prediction_one=}")
    print(f"{len(prediction_one)=}")

    print(predictions)
    print(len(predictions))
