import os
from keras.models import Model
from django.conf import settings


async def save_model(
        *,
        file_name: str,
        model: Model
):
    try:
        upload_dir = os.path.join(settings.MODELS_DIR, f"{file_name}.weights.h5")
        model.save_weights(upload_dir, overwrite=True)
        print(f"Saved model to {upload_dir} as {file_name}.weights.h5")
    except Exception as e:
        raise Exception(f"Not saving model due to {e}")
