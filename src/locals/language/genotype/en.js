import { mapGamepadToXbox360Controller } from "@vueuse/core";

// en.js
export default {
    genotype: {
        index: {
            node_add: 'Add Node',
            node_update: 'Update Node',
            node_delete: 'Delete Node',
            template_download: 'Download Template File',

            search: 'Search',
            reset: 'Reset',
            download: 'Download',
            cancel: 'Cancel',
            preview: 'Preview',
            merge: 'Merge',
            save: 'Save',
            upload: 'Upload',

            file_add: 'Add',
            file_delete: 'Delete',

            table_index: 'Index',
            table_fileName: 'File Name',
            table_speciesName: 'Species Name',
            table_populationName: 'Population Name',
            table_year: 'Year',
            table_location: 'Location',
            table_fileStatus: 'Status',
            table_operate: 'Operations',
            table_previousVersions: 'Versions',
            table_merge: 'Merger',


            tooltip_detail: 'Details',
            tooltip_view: 'View',
            tooltip_delete: 'Delete',
            tooltip_historicalVersions: 'View Previous Versions',
            tooltip_merge: 'Merge',
            tooltip_screen:'Gene Screen',
            tooltip_heatmap:'Gene Heatmap',

            placeholder_fileName: 'Enter the file name.',
            placeholder_node: 'Enter the node name.',
            placeholder_comment: 'Enter the comment',

            title_create: 'Add A File',
            title_update: 'Update A File',
            title_other: 'Merge Files',
            title_createNode: 'Add A Node',
            title_updateNode: 'Update A Node',
            title_history: 'Previous Versions',


            dialog_nodeName: 'Node Name: ',
            dialog_status: 'Status: ',
            dialog_fileName: 'File Name: ',
            dialog_comment: 'Comment: ',
            dialog_upload: 'Upload: ',

            name_require:'The file name format must be "Species_Population"',


            message_getListFailed: "Retrieving list failed!",
            message_input_fileName: "File name cannot be empty!",
            message_input_nodeName: "Node name cannot be empty!",
            message_input_status: "Please select a status!",
            message_input_date: "Please select a date!",
            message_upload_vcf: "Only CSV file format is allowed for upload!",
            message_upload_wait: "The upload data is large; please wait patiently!",
            message_upload_compare: "The format is incorrect; please download and compare with the template file!",
            message_upload_fail: "Upload failed!",
            message_upload_success: "Upload successful!",
            message_delete_select: "No file has been selected!",
            message_delete_confirm: "Are you sure you want to delete the file?",
            message_delete_success: "Deletion successfully!",
            message_delete_fail: "Deletion failed!",
            message_update_success: "Update successfully!",
            message_update_fail: "Update failed!",
            message_downloading: "Downloading, please wait...",
            message_node_parent: "Please select a parent node!",
            message_node_add_success: "Node added successfully!",
            message_node_add_fail: "Adding node failed!",
            message_node_update_success: "Node updated successfully!",
            message_node_update_fail: "Updating node failed!",
            message_node_select: "Please select a node!",
            message_node_confirm: "Are you sure you want to delete this node?",
            message_node_delete_success: "Node deletion successful!",
            message_file_confirm: "Are you sure you want to delete the file?",


        },
        file: {
            table_operate: 'Operations',


            button_search: 'Search',
            button_reset: 'Reset',
            button_export: 'Export',
            button_save: 'Save',
            button_cancel: 'cancel',

            wait:'File generation in progress, please wait!',


            placeholder_material: 'Select the material name.',

            title_update: 'Update File Details',

            tooltip_update: 'Update',

            rule_key:'Please input key name.',
            rule_value:'Please input value.',
            placeholder:'Please input value.',

        },
        area: {
            button_search: 'Search',

            table_index: 'Index',
            table_traitName: 'Trait Name',
            table_fullName: 'Full Name',
            table_abbreviationName: 'Abbreviation',
            table_remark: 'Remark',
            table_name: 'Name',
            table_type: 'Type',
            table_location: 'Location',
            table_longitude: 'Longitude',
            table_latitude: 'Latitude',

            label_country: 'Country',
            label_location: 'Location',
            label_longitude: 'Longitude',
            label_latitude: 'Latitude',


            header1: 'Search Traits',
            header2: 'Search Locations',


        },
        view: {
            header:'Chromosome Density Map',
        },

        filter:{
            header:'Gene Screen',
            label:{
                index:'Index',
                name:'Material Name',
                placeholder:'Please select.'
            },
            t1:'Chromosome: ',
            t2:'Position: ',
            t3:'Marker: ',
            t4:'Info: ',
        },

        heatmap:{
            header:'Gene Heatmap',
            ph:{
                name:'Material Name',
                gene:'Genotype',
                start:'Start Number',
                end:'End Number',
            }
        },
        pca:{
            header:'Phenotype File Selection',
            noFile:'No files under this node.'
        }
    }
}
