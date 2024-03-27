import os
import matplotlib.pyplot as plt


async def save_figure_of_learning(
        *,
        history,
        epochs,
        file_name,
        path_to_save,
):
    acc = history.history["accuracy"]
    val_acc = history.history["val_accuracy"]

    loss = history.history["loss"]
    val_loss = history.history["val_loss"]

    epochs_range = range(epochs)

    plt.figure(figsize=(8, 8))
    plt.subplots_adjust(top=0.92, bottom=0.08, left=0.07, right=.95, wspace=0.25)

    plt.subplot(1, 2, 1)
    plt.plot(epochs_range, acc, label='Training Accuracy', color="#352F44")
    plt.plot(epochs_range, val_acc, label='Validation Accuracy', color="#FF9494")
    plt.legend(loc="lower right")
    plt.title("Training and Validation Accuracy")

    plt.subplot(1, 2, 2)
    plt.plot(epochs_range, loss, label='Training Loss', color="#352F44")
    plt.plot(epochs_range, val_loss, label='Validation Loss', color="#FF9494")
    plt.legend(loc="upper right")
    plt.title("Training and Validation Loss")

    plt.savefig(f"{os.path.join(path_to_save, file_name)}.webp", format="webp")
