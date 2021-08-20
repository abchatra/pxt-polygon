/**
 * Build Polygon geometric shapes
 */
//% weight=94 color=#ffab19 icon="\uf287"
    namespace polygon {
    /**
     * Fill a line of blocks from one position to another.
     */
     function drawPolygon(x0: number, y0: number, radius: number, block: number, toWorld: (x: number, y: number) => Position) {
        let x = radius;
        let y = 0;
        let err = 0;

        while (x >= y) {
            blocks.place(block, toWorld(x0 + x, y0 + y));
            blocks.place(block, toWorld(x0 + x, y0 - y))

            blocks.place(block, toWorld(x0 + y, y0 + x));
            blocks.place(block, toWorld(x0 + y, y0 - x));

            blocks.place(block, toWorld(x0 - y, y0 + x));
            blocks.place(block, toWorld(x0 - y, y0 - x));

            blocks.place(block, toWorld(x0 - x, y0 + y));
            blocks.place(block, toWorld(x0 - x, y0 - y));


            if (err <= 0) {
                y += 1;
                err += 2 * y + 1;
            }
            if (err > 0) {
                x -= 1;
                err -= 2 * x + 1;
            }
        }
    }

    function fillPolygon(x0: number, y0: number, radius: number, block: number, toWorld: (x: number, y: number) => Position) {
        let x = radius;
        let y = 0;
        let err = 0;

        while (x >= y) {
            blocks.fill(block, toWorld(x0 + x, y0 + y), toWorld(x0 + x, y0 - y));
            blocks.fill(block, toWorld(x0 + y, y0 + x), toWorld(x0 + y, y0 - x));
            blocks.fill(block, toWorld(x0 - y, y0 + x), toWorld(x0 - y, y0 - x));
            blocks.fill(block, toWorld(x0 - x, y0 + y), toWorld(x0 - x, y0 - y));

            if (err <= 0) {
                y += 1;
                err += 2 * y + 1;
            }
            if (err > 0) {
                x -= 1;
                err -= 2 * x + 1;
            }
        }
    }

    /**
     * Fill a regular polygon of blocks at a center position.
     * @param radius the radius of the polygon, eg: 5
     */
    //% blockId=minecraftCircle block="polygon of %block=minecraftBlock|center %center=minecraftCreatePosition|radius %radius|around %orientation|%operator"
    //% block.shadow=minecraftBlock
    //% blockExternalInputs=1 weight=95
    //% help=shapes/polygon

    export function polygon(block: number,
        center: Position,
        radius: number,
        orientation: Axis,
        operator: ShapeOperation) {
        if (radius <= 0) return;

        if (operator == ShapeOperation.Hollow) {
            polygon(Block.Air, center, radius, orientation, ShapeOperation.Replace);
            polygon(block, center, radius, orientation, ShapeOperation.Outline);
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
                drawPolygon(xc, zc, radius, block, toWorld);
            } else if (operator == ShapeOperation.Replace) {
                fillPolygon(xc, zc, radius, block, toWorld);
            }
        } else if (orientation == Axis.Z) {
            const toWorld = (x: number, y: number) => positions.createWorld(x, y, zc);
            if (operator == ShapeOperation.Outline) {
                drawPolygon(xc, yc, radius, block, toWorld);
            } else if (operator == ShapeOperation.Replace) {
                fillPolygon(xc, yc, radius, block, toWorld);
            }
        } else { // X axis
            const toWorld = (y: number, z: number) => positions.createWorld(xc, y, z);
            if (operator == ShapeOperation.Outline) {
                drawPolygon(yc, zc, radius, block, toWorld);
            } else if (operator == ShapeOperation.Replace) {
                fillPolygon(yc, zc, radius, block, toWorld);
            }
        }
    }
}