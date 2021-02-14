const { I2C, I2CDevice} = require.main.require("./lib/i2c");

class RelayController extends I2CDevice
{
    constructor(bus, bus_enable_gpio)
    {
        if(bus instanceof I2CDevice)
            super(bus.bus, bus.addr, bus.bus_enable_gpio);
        else
            super(bus, 0x3A, bus_enable_gpio);
    }

    async write(reg, data)
    {
        if(typeof(reg) !== "number" || reg < 0 || reg > 255)
            throw new Error("Invalid register");

        if(typeof(data) === "number")
            data = [data];

        if(Array.isArray(data))
            data = Buffer.from(data);

        if(!(data instanceof Buffer))
            throw new Error("Invalid data");

        let buf = Buffer.alloc(data.length + 1, 0);

        buf.writeUInt8(reg, 0);
        data.copy(buf, 1, 0);

        await super.write(buf);
    }
    async read(reg, count = 1)
    {
        if(typeof(reg) !== "number" || reg < 0 || reg > 255)
            throw new Error("Invalid register");

        if(typeof(count) !== "number" || count < 1)
            throw new Error("Invalid count");

        await super.write(reg);

        return super.read(count);
    }

    async get_unique_id()
    {
        let buf = await this.read(0xF8, 8);

        return buf.readUInt32LE(4) + "-" + buf.readUInt32LE(0);
    }
    async get_software_version()
    {
        let buf = await this.read(0xF4, 2);

        return buf.readUInt16LE(0);
    }
    async get_chip_temperatures()
    {
        let buf = await this.read(0xE0, 8);

        return {
            emu: buf.readFloatLE(0),
            adc: buf.readFloatLE(4)
        };
    }
    async get_chip_voltages()
    {
        let buf = await this.read(0xD0, 16);

        return {
            avdd: buf.readFloatLE(0),
            dvdd: buf.readFloatLE(4),
            iovdd: buf.readFloatLE(8),
            core: buf.readFloatLE(12)
        };
    }
    async get_system_voltages()
    {
        let buf = await this.read(0xC0, 4);

        return {
            vin: buf.readFloatLE(0)
        };
    }

    // TODO
}

module.exports = RelayController;