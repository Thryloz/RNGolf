class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200;
        this.SHOT_VELOCITY_Y_MIN = 700;
        this.SHOT_VELOCITY_Y_MAX = 1100;
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width/2, height/10, 'cup');
        this.cup.body.setCircle(this.cup.width/4);
        this.cup.body.setOffset(this.cup.width/4);
        this.cup.body.setImmovable(true);
      
        // add ball
        this.ball = this.physics.add.sprite(width/2, height - height/10, 'ball');
        this.ball.body.setCircle(this.ball.width/2);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.setBounce(0.5);
        this.ball.body.setDamping(true).setDrag(0.5);

        // add walls
        let wallA = this.physics.add.sprite(0, height/4, 'wall');
        wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width/2))
        wallA.body.setImmovable(true)
        wallA.body.setCollideWorldBounds(true);
        wallA.setVelocity(200, 0);
        wallA.setBounce(1);





        let wallB = this.physics.add.sprite(0, height/2, 'wall');
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width/2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])
        // add one-way
        this.oneWay = this.physics.add.sprite(width/2, height/4*3, 'oneway');
        this.oneWay.setX(Phaser.Math.Between(0+this.oneWay.width/2, width - this.oneWay.width/2))
        this.oneWay.setImmovable(true);
        this.oneWay.body.checkCollision.down = false;

        // add pointer input
        // Phaser.Math.Between is random num between the min and max given
        this.input.on('pointerdown', (pointer) => {
            let shotDirection = pointer.y <= this.ball.y ? 1 : -1;
            let shotDirectionX = pointer.x <= this.ball.x ? 1 : -1;
            this.ball.body.setVelocityX(Phaser.Math.Between(0, this.SHOT_VELOCITY_X) * shotDirectionX);
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection);
            this.clickCounter += 1;
        })
        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            this.ball.setX(width/2)
            this.ball.setY(height - height/10)
            this.ball.setVelocity(0,0)
            this.shotCounter += 1;
            
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls);

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)

        this.shotCounter = 0;
        this.clickCounter = 0;
        this.shotCounterTxt = this.add.text(width-200, 10, `Shot Counter: ${this.shotCounter}`).setColor('black').setBackgroundColor('white');
        this.scoreTxt = this.add.text(width-200, 40, `Score: ${this.shotCounter * 10}`).setColor('black').setBackgroundColor('white');
        this.percentageTxt = this.add.text(width-200, 70, `Percentage: ${Math.round(this.shotCounter/this.clickCounter * 100)}%`).setColor('black').setBackgroundColor('white');
    }

    update() {
        this.shotCounterTxt.text = `Shot Counter: ${this.shotCounter}`;
        this.scoreTxt.text = `Score: ${this.shotCounter * 10}`;
        this.percentageTxt.text = `Percentage: ${Math.round(this.shotCounter/this.clickCounter * 100)}%`;
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[X] Add ball reset logic on successful shot
[X] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[X] Make one obstacle move left/right and bounce against screen edges
[X] Create and display shot counter, score, and successful shot percentage
*/