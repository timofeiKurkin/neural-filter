from scapy.all import Packet


def is_valid_packet(*, packet: Packet) -> bool:
    if not packet.haslayer("IP"):
        return False
    return True
