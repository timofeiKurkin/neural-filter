from keras.models import Model


async def neural_network_fit(
        *,
        neural_model: Model,
        x_train,
        x_test,
        **kwargs
):
    history = neural_model.fit(
        x=x_train,
        y=x_test,
        **kwargs
    )

    return history
