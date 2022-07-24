class Fitting {
    static #findPassedTrafficCount(car, traffic) {
        const passedTraffic = car.passedTraffic;
        traffic.forEach((trafficCar) => {
            if (car.cY < trafficCar.cY) {
                if (!passedTraffic.find(id => id === trafficCar.id)) {
                    passedTraffic.push(trafficCar.id)
                };
            };
        });
        return passedTraffic.length;
    };

    static findCarWithMaxY(cars) {
        return cars.find(car => car.cY === Math.min(...cars.map(i => i.cY)))
    };

    static #findPassedMost(cars, traffic) {
        const passedMost = [new Car(0, 0, 0, 0, "", "", 0)];
        for (let i = 0; i < cars.length; i++) {
            cars[i].passedTrafficCount = this.#findPassedTrafficCount(cars[i], traffic);
            if (cars[i].passedTrafficCount > passedMost[passedMost.length - 1].passedTrafficCount) {
                passedMost.length = 0;
                passedMost.push(cars[i]);
            };
            if (cars[i].passedTrafficCount === passedMost[passedMost.length - 1].passedTrafficCount) {
                passedMost.push(cars[i]);
            };
        };
        return passedMost;
    };

    static findBestCar(cars, traffic) {
        const candidates = this.#findPassedMost(cars, traffic);
        return this.findCarWithMaxY(candidates);
    };

};
