
// @ts-ignore
import express, { Request, Response } from "express"
import {AbiCoder} from "ethers";
import {guessFragment} from "@openchainxyz/abi-guesser";

const port = 3001
const app = express()
app.use(express.json());

let abi = new AbiCoder()

// @ts-ignore
BigInt.prototype.toJSON = function() {
    return this.toString()
}
function analyze(calldata:string) {
    let data = '0x'+calldata.substring(8+2)
    let fragment = guessFragment(calldata)!;
    let argTypes = fragment.inputs.map(a=>a.type)
    let outputTypes = fragment.outputs.map(a=>a.type)
    let x = abi.decode(argTypes, data)

    return {
        fnSig: fragment.name,
        inputTypes: argTypes,
        input: x,
        outputTypes: outputTypes
    }
}

app.get("/ping", (req: Request, res: Response) => {
    res.json("pong")
})

app.post("/guesser", (req: Request, res: Response) => {
    let r = req.body

    if (!r || !r.length) return res.json('Invalid post data. need array of tx.data with 0x prefix and fn signature')
    r = r.filter((a:string) => a.startsWith('0x'))

    let result = []
    for (let i = 0; i < r.length; i++) {
        const calldata = r[i];
        try {
            result.push(analyze(calldata))
        } catch (e:any) {
            result.push({msg: e.message, stack: e.stack})
        }
    }

    return res.json(result)
})

app.listen(port, () => {
    console.log("Server listening on port ", port)
})


// pm2 start "npx ts-node ./webserver-test.ts" --name test -i 4 -- start