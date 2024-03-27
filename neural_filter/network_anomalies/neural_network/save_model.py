import os
from keras.models import Model


async def save_model(
        *,
        file_name,
        path_to_save,
        model: Model
):
    try:
        model.save_weights(os.path.join(path_to_save, file_name), overwrite=True)
        print(f"Saved model to {path_to_save} as {file_name}")
    except Exception as e:
        raise Exception(f"Not saving model due to {e}")
