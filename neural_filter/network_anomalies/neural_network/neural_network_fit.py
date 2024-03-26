from keras.models import Model


async def neural_network_fit(
        *,
        neural_model: Model,
        x_train,
        x_test,
        epochs: int,
        batch_size: int,
        shuffle: bool,
        validation_data: tuple
):
    history = neural_model.fit(
        x=x_train,
        y=x_test,
        epochs=epochs,
        batch_size=batch_size,
        shuffle=shuffle,
        validation_data=validation_data
    )

    return history
