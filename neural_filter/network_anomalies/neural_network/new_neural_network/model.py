import json
import numpy as np
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

dataset = np.load("dataset.npz")

if dataset:
    (X_train, y_train), (X_test, y_test) = (
        (dataset["X_train"], dataset["y_train"]),
        (dataset["X_test"], dataset["y_test"]))

    model = keras.Sequential([
        keras.layers.LSTM(
            units=6
        ),
        # keras.layers.Dense(units=6, activation="relu"),
    ], name="traffic_classification")

    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    model.summary()

    model.fit(
        x=X_train,
        y=y_train,
        epochs=15,
        batch_size=32,
        validation_data=(X_test, y_test)
    )
