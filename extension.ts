/**
 * Build Polygon geometric shapes
 */
//% weight=94 color=#ffab19 icon="\uf287"
namespace polygon {

     function draw2DPolygon(center_x: number, center_y: number, radius: number, sides:number, block: number, toWorld: (x: number, y: number) => Position) {

        let PI = 3.14159265358979311600;
        let lastX = center_x +  radius * Math.cos(0) //cos(0) == 1;
        let lastY = center_y +  radius *  Math.sin(0) //sin(0) == 0;

        for (let i = 1; i <= sides; i += 1) {
            let newX = center_x + Math.ceil(radius * Math.cos(i * 2 * PI / sides));
            let newY = center_y + Math.ceil(radius * Math.sin(i * 2 * PI / sides));
            shapes.line( block, toWorld(lastX, lastY), toWorld(newX, newY));
            lastX = newX;
            lastY = newY;
        }
    }

    function fill2DPolygon(center_x: number, center_y: number, radius: number, sides:number, block: number, toWorld: (x: number, y: number) => Position) {

    }

    /**
     * Fill a regular polygon of blocks at a center position.
     * @param radius the radius of the polygon, eg: 5
     */
    //% blockId=minecraftPolygon block="polygon of %block=minecraftBlock|center %center=minecraftCreatePosition|radius %radius|sides %sides |around %orientation|%operator"
    //% block.shadow=minecraftBlock
    //% blockExternalInputs=1 weight=95
    //% help=shapes/polygon
    //% radius.defl=5
    //% operator.defl=ShapeOperation.Outline

    export function polygon(block: number,
        center: Position,
        radius: number,
        sides: number,
        orientation: Axis,
        operator: ShapeOperation) {
        if (radius <= 0) return;

        if (operator == ShapeOperation.Hollow) {
            polygon(Block.Air, center, radius, sides, orientation, ShapeOperation.Replace);
            polygon(block, center, radius, sides, orientation, ShapeOperation.Outline);
            return;
        }

        center = center.toWorld();
        const xc = center.getValue(Axis.X);
        const yc = center.getValue(Axis.Y);
        const zc = center.getValue(Axis.Z);
        const radius2 = radius * radius;
        const radiuso = (radius - 1) * (radius - 1)

        if (orientation == Axis.Y) {
            const toWorld = (x: number, z: number) => positions.createWorld(x, yc, z);
            if (operator == ShapeOperation.Outline) {
                draw2DPolygon(xc, zc, radius, sides, block, toWorld);
            } else if (operator == ShapeOperation.Replace) {
                fill2DPolygon(xc, zc, radius, sides, block, toWorld);
            }
        } else if (orientation == Axis.Z) {
            const toWorld = (x: number, y: number) => positions.createWorld(x, y, zc);
            if (operator == ShapeOperation.Outline) {
                draw2DPolygon(xc, yc, radius, sides, block, toWorld);
            } else if (operator == ShapeOperation.Replace) {
                fill2DPolygon(xc, yc, radius, sides, block, toWorld);
            }
        } else { // X axis
            const toWorld = (y: number, z: number) => positions.createWorld(xc, y, z);
            if (operator == ShapeOperation.Outline) {
                draw2DPolygon(yc, zc, radius, sides, block, toWorld);
            } else if (operator == ShapeOperation.Replace) {
                fill2DPolygon(yc, zc, radius, sides, block, toWorld);
            }
        }
    }
}