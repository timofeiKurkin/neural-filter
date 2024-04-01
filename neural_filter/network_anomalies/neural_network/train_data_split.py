from sklearn.model_selection import train_test_split


async def train_data_split(*, features, **kwargs):
    x_train, x_test = train_test_split(
        features,
        **kwargs
    )

    return x_train, x_test
