from collections import defaultdict
from typing import DefaultDict, List

from scapy.all import Packet, PacketList, PcapWriter, Raw
from tqdm import tqdm

from .packets_validation import is_valid_packet


def split_sessions(
    *, packages: PacketList, output_directory: str, max_seq_length: int = 128
) -> int:
    sessions: DefaultDict[str, List[Packet]] = defaultdict(list)

    print("\n==== Distribution of packages by session ====")

    for packet in tqdm(packages):
        if not is_valid_packet(packet=packet):
            continue

        ip_src: str = packet["IP"].src
        ip_dst: str = packet["IP"].dst

        if Raw in packet:
            del packet[Raw]

        f_key = f"{ip_src}-{ip_dst}"
        if f_key in sessions:
            sessions[f_key].append(packet)
        else:
            sessions[f"{ip_dst}-{ip_src}"].append(packet)

    print("\n==== Writing packages to files ====")
    for session_key, sessions_packets in tqdm(
        sorted(sessions.items(), key=lambda x: len(x[1]))[-max_seq_length:]
    ):
        write_pcap = PcapWriter(filename=f"{output_directory}/{session_key}.pcapng")
        write_pcap.write(sessions_packets[-max_seq_length:])
        write_pcap.flush()
        write_pcap.close()

    print("==== Finished writing packages to files ====")

    return len(sessions.keys())
