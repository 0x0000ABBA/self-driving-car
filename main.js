// Инициализация холстов
const carCanvas = document.getElementById("carCanvas");
const carCtx = carCanvas.getContext("2d");
const networkCanvas = document.getElementById("networkCanvas");
const networkCtx = networkCanvas.getContext("2d");
// Конфигурация симуляции
const laneCount = 3; // Количество полос на дороге
const trafficCount = 100; // Количество трафика
const carCount = 400;
networkCanvas.width = 900; // Ширина визуализатора нейросети
carCanvas.width = 300; // Ширина дороги
const trafficMaxSpeed = 8; // Максимальная скорость траффика
const carMaxSpeed = 10; // Максимальаня скорость машины
const lifeTime = 30000; // Максимальное время жизни в кадрах

const road = new Road(carCanvas.width * 0.9, carCanvas.width / 2, laneCount);

const findBestCar = (cars) => {
    return cars.find(car => car.cY === Math.min(...cars.map(i => i.cY)))
};

const generateTraffic = (carCount) => {
    const traffic = [new Car(40, 60, road.getLaneCenter(1), 350, "DUMMY", getRandomColor(), trafficMaxSpeed, 0)];
    for (let i = 0; i < carCount; i++) {
        traffic.push(new Car(40, 60, road.getLaneCenter(Math.floor((laneCount + 1) * Math.random())), traffic[i].cY - 200 - Math.random() * 150, "DUMMY", getRandomColor(), trafficMaxSpeed, i))
    };
    return traffic;
};

const generateCars = (carCount) => {
    const cars = [];
    for (let i = 0; i < carCount; i++) {
        cars.push(new Car(40, 60, road.getLaneCenter(1), 450, "AI", "Pink", carMaxSpeed))
    };
    return cars;
};

const saveAndReload = (time, lifeTime, bestCar) => {
    const myLocalStorage = window.localStorage
    if (time > lifeTime) {
        if (myLocalStorage.getItem("generation")) {
            const currentGeneration = +myLocalStorage.getItem("generation") + 1;
            myLocalStorage.removeItem("generation")
            myLocalStorage.setItem("generation", currentGeneration)
        } else {
            myLocalStorage.setItem("generation", 1)
        }
        if (myLocalStorage.getItem("bestCar")) {
            myLocalStorage.removeItem("bestCar");
            myLocalStorage.setItem("bestCar", JSON.stringify(bestCar.brain))
            location.reload();
        } else {
            myLocalStorage.setItem("bestCar", JSON.stringify(bestCar.brain))
            location.reload();
        };

    };
};

const generateNewGeneration = () => {
    if (localStorage.getItem("bestCar")) {
        for (let i = 0; i < cars.length; i++) {
            cars[i].brain = JSON.parse(localStorage.getItem("bestCar"));
            if (i != 0) {
                NeuralNetwork.mutate(cars[i].brain, 0.1);
            }
        }
    }
};

const destroy = () => {
    window.localStorage.removeItem("bestCar");
    window.localStorage.removeItem("generation");
    window.localStorage.setItem("generation", 1)
    location.reload();
};

let bestCar;

const cars = generateCars(carCount);

const traffic = generateTraffic(trafficCount);

generateNewGeneration();

console.log("Current generation: ",window.localStorage.getItem("generation"));

const animate = (time) => {

    saveAndReload(time, lifeTime, bestCar);

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    };
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    };

    bestCar = Fitting.findBestCar(cars, traffic);
    carWithBestY = Fitting.findCarWithMaxY(cars);
    carCanvas.height = window.innerHeight;
    bestCar.color = "red";
    networkCanvas.height = window.innerHeight;
    carCtx.save();
    carCtx.translate(0, -carWithBestY.cY + carCanvas.height * 0.8)
    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx);
    };
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx);
    };
    carCtx.globalAlpha = 1;
    carWithBestY.draw(carCtx, true)
    carCtx.restore();

    networkCtx.lineDashOffset = -time / 40;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);

    requestAnimationFrame(animate)
};

animate();

