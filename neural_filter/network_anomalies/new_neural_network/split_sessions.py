from scapy.all import PcapWriter


def split_sessions(
        *,
        pcap_file,
        output_directory
):
    sessions = {}

    for packet in pcap_file:
        if packet.haslayer("IP") and (packet.haslayer("TCP") or packet.haslayer("UDP")):
            src_ip = "-".join(packet["IP"].src.split("."))
            dst_ip = "-".join(packet["IP"].dst.split("."))

            src_port = ""
            dst_port = ""

            if packet.haslayer("TCP"):
                src_port = packet["TCP"].sport
                dst_port = packet["TCP"].dport
            elif packet.haslayer("UDP"):
                src_port = packet["UDP"].sport
                dst_port = packet["UDP"].dport

            session_key = f"{src_ip}_{src_port}_{dst_ip}_{dst_port}"

            if session_key not in sessions:
                sessions[session_key] = []
            sessions[session_key].append(packet)

    for session_key, sessions_packets in sessions.items():
        write_pcap = PcapWriter(filename=f"{output_directory}/{session_key}.pcap")
        write_pcap.write(sessions_packets)
        write_pcap.flush()

    return len(sessions)
