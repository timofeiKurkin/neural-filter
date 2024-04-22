import subprocess
import os

from django.conf import settings


def split_cap(
        *,
        # pcap_file_location,
        # output_directory_location,
        model_id
):
    model_path = os.path.join(settings.MODELS_DIR, str(model_id))

    read_path = f"{model_path}/Packages.pcap"
    output_path = f"{model_path}/Result/"

    command = [
        # "sudo",
        "wine",
        "/SplitCap.exe",
        "-r",
        read_path,
        # "Packages.pcap",
        "-o",
        output_path,
        # "Result/",
        "-d",
        "-s",
        "session",
    ]

    # print(f"{''.join(command)=}")
    # print(f"{read_path=}")
    # print(f"{output_path=}")
    subprocess.run(command)

# Example:
# split_cap(pcap_file_name="./pcaps/MyPackages4.pcap", output_directory="MyPackages4/")
