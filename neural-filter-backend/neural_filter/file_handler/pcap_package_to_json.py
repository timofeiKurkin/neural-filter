def pcap_package_to_json(
        protocol_format=None,
        time_format=None,
        *,
        pcap_package,
        package_id,
):
    package = {
        "id": package_id,
        "time": time_format or pcap_package.time,
        "source": pcap_package["IP"].src,
        "destination": pcap_package["IP"].dst,
        "protocol": protocol_format or pcap_package['IP'].proto,
        "length": len(pcap_package)
    }

    return package
