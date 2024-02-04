import { TimelinePipe } from "@pnp/core";
import { parseBinderWithErrorCheck } from "@pnp/queryable";
import { Post } from "../models/Post";
import { IPostServerObj } from "../models/IPostServerObj";

// top level function allows binding of values within the closure
export function CustomParse(): TimelinePipe<any> {
    // returns the actual behavior function that is applied to the instance
    return parseBinderWithErrorCheck(async (r) => {
        debugger;
        const json = await r.json()
        if (json.value) {
            json.value = json.value.map((v: IPostServerObj) => new Post(v))
            return json;
        }

        if (json.results) {
            json.results = json.results.map((v: IPostServerObj) => new Post(v))
            return json;
        }
    });
}