export interface GetInterfaces {
    id: number;
    title: string;
}

export interface HeaderItemsType {
    id: number;
    title: string;
}

export interface TrafficPackageType {
    id: number;
    time: number;
    source: string;
    destination: string;
    protocol: string;
    length: number;
}

export interface AnomalyTrafficPackageType extends TrafficPackageType {
    MACSrc: string;
    portSrc: string;
    MACDst: string;
    portDst: string;
}