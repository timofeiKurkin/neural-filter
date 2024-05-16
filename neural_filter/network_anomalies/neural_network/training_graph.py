import os
import matplotlib.pyplot as plt

async def training_graph(
        *,
        history,
        epochs,
        file_name,
        path_to_save
):
    recall = history.history["recall"]
    val_recall = history.history["val_recall"]

    loss = history.history["loss"]
    val_loss = history.history["val_loss"]

    epochs_range = range(epochs)

    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(6, 6))

    fig.subplots_adjust(top=0.92, bottom=0.08, left=0.07, right=.95, wspace=0.25)

    ax1.plot(epochs_range, recall, label='Training Recall', color="#352F44")
    ax1.plot(epochs_range, val_recall, label='Validation Recall', color="#FF9494")
    ax1.legend(loc="lower right")
    ax1.set_title("Training and Validation Recall && Precision")

    ax2.plot(epochs_range, loss, label='Training Loss', color="#352F44")
    ax2.plot(epochs_range, val_loss, label='Validation Loss', color="#FF9494")
    ax2.legend(loc="upper right")
    ax2.set_title("Training and Validation Loss")

    plt.show()
    plt.savefig(f"{os.path.join(path_to_save, file_name)}.webp", format="webp", dpi=300)