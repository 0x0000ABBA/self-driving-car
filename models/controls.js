class Controls {
    constructor(controlType) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;
        this.isDummy = false;

        switch (controlType) {
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.isDummy = true;
                break;
            case "AI":
                break;
        };
    };

    #addKeyboardListeners() {
        document.onkeydown = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.forward = true;
                    break;
                case 'ArrowLeft':
                    this.left = true;
                    break;
                case 'ArrowRight':
                    this.right = true;
                    break;
                case 'ArrowDown':
                    this.reverse = true;
                    break;
            }
        }
        document.onkeyup = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.forward = false;
                    break;
                case 'ArrowLeft':
                    this.left = false;
                    break;
                case 'ArrowRight':
                    this.right = false;
                    break;
                case 'ArrowDown':
                    this.reverse = false;
                    break;
            }
        }
    };

}