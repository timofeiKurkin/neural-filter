from scapy.all import PcapWriter


def split_sessions(
        *,
        pcap_file,
        output_directory
):
    sessions = {}

    for packet in pcap_file:
        if packet.haslayer("IP") and packet.haslayer("TCP"):
            src_ip = "-".join(packet["IP"].src.split("."))
            src_port = packet["TCP"].sport
            src_key = f"{src_ip}_{src_port}"

            dst_ip = "-".join(packet["IP"].dst.split("."))
            dst_port = packet["TCP"].dport
            dst_key = f"{dst_ip}_{dst_port}"

            keys_with_sessions = [key for key in sessions.keys() if src_key in key and dst_key in key]

            if len(keys_with_sessions) == 1:
                sessions[keys_with_sessions[0]].append(packet)
            else:
                session_key = f"{dst_key}_{src_key}"
                if session_key not in sessions:
                    sessions[session_key] = []
                sessions[session_key].append(packet)

    session_len = len(sessions)

    for session_key, sessions_packets in sessions.items():
        write_pcap = PcapWriter(filename=f"{output_directory}/{session_key}.pcap")
        write_pcap.write(sessions_packets)
        write_pcap.flush()
        del sessions[session_key]

    return session_len
