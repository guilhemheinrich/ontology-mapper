import * as commander from 'commander'
import * as path from 'path';
import * as fs from 'fs-extra'
import OWL_Mapper from './src/ontology-mapper/ontology-mapper'
import * as dotenv from 'dotenv'

const cli = new commander.Command()
const BASE_CALL_DIR = process.cwd()
let root_output_path: string;
let root_input_path: string;
let prefixes_array: string[] = [];
dotenv.config()

export const module = {
    async execute(ontologies_folder: string, generated_mapping: string) {
        const rdf_service = await OWL_Mapper.getInstance(ontologies_folder)
        fs.ensureDirSync(path.dirname(generated_mapping))
        rdf_service.writeMappings(generated_mapping)
    }
}
cli
    .description('Scan a file or a folder, and generate a mapping file to use with a Synfony instance (See @rdf-serializer - link) using OWL semantics')
    .option('-s --ontologies_source <string>', 'Path to the resource containing semantized data (folder or file). If not provided, will look for an environment variable called ONTOLOGIES_FOLDER')
    .option('-d --generated_mapping_file <string>', 'Destination path of the generated path')
    // TODO Handle prefixes
    // .option("-p --prefixes <string>", 'Path to a JSON file containing an array of the form: {"uri": uri, "prefix": prefix}')
    .option("--show", 'Show the computed pathes', false)
    .action((cmdObj) => {
        // path from the input
        root_input_path = path.resolve(BASE_CALL_DIR, cmdObj.ontologies_source ?? <string>process.env["ONTOLOGIES_FOLDER"] ?? ".")
        root_output_path = path.resolve(BASE_CALL_DIR, cmdObj.generated_mapping_file ?? <string>process.env["GENERATED_MAPPING_DESTINATION"]?? "generated.yaml")
        console.log(`
    ontologies source path: ${root_input_path}
    generated mappings path: ${root_output_path}
    `)
    // prefixes array path: ${prefixes_array}
        if (!cmdObj.show) {
            module.execute(root_input_path, root_output_path)
        }
    })

cli.parse(process.argv)

