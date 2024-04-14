import subprocess


def split_cap(
        *,
        pcap_file_name,
        output_folder
):
    exe_program = "SplitCap.exe"
    command = ["wine", exe_program, "-r", pcap_file_name, "-s", "session", "-o", output_folder]
    subprocess.run(command)


#
split_cap(pcap_file_name="./pcaps/MyPackages4.pcap", output_folder="MyPackages4/")
