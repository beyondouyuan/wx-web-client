export function cleanSearchCache(userSelect) {
    delete userSelect['dropoff']['pickTime'];
    delete userSelect['dropoff']['time'];
    delete userSelect['dropoff']['toDoor'];
    delete userSelect['dropoff']['oplace'];
    delete userSelect['dropoff']['channel'];
    delete userSelect['dropoff']['timeStr'];

    delete userSelect['pickup']['dropTime'];
    delete userSelect['pickup']['time'];
    delete userSelect['pickup']['toDoor'];
    delete userSelect['pickup']['oplace'];
    delete userSelect['pickup']['channel'];
    delete userSelect['pickup']['timeStr'];
}