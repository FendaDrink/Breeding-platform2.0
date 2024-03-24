// en.js
export default {
    phenotype: {
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
            table_populationName: 'Population',
            table_year: 'Year',
            table_location: 'Location',
            table_fileStatus: 'Status',
            table_operate: 'Operations',
            table_previousVersions: 'Versions',
            table_merge: 'Merger',


            tooltip_detail: 'Details',
            tooltip_view: 'View',
            tooltip_delete: 'Delete',
            tooltip_histoicalVersions: 'View Previous Versions',
            tooltip_merge: 'Merge',

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


            message_getListFailed: 'Failed to get list!',
            message_input_fileName: 'The file name cannot be empty!',
            message_input_nodeName: 'The node name cannot be empty!',
            message_input_status: 'Please select',
            message_input_date: 'Please select a date!',
            message_upload_csv: 'Only files in CSV format can be uploaded!',
            message_upload_wait: 'The upload data is large, please be patient!',
            message_upload_compare: 'The format is incorrect, please download the template file for comparison!',
            message_upload_fail: 'Upload failed!',
            message_upload_success: 'Upload successfully!',
            message_delete_select: 'You didn\'t choose the file!',
            message_delete_confirm: 'Do you want to delete files?',
            message_delete_success: 'Delete successfully!',
            message_delete_fail: 'Delete failed!',
            message_update_succcess: 'Update Successfully!',
            message_update_fail: 'Update failed!',
            message_downloading: 'Downloading, please wait...',
            message_node_parent: 'Please select the parent node!',
            message_node_add_success: 'Add node successfully!',
            message_node_add_fail: 'Add node failed',
            message_node_update_success: 'Update node successfully!',
            message_node_update_fail: 'Update node failed!',
            message_node_select: 'Please select a node!',
            message_node_confirm: 'Do you want to delete the node?',
            message_node_delete_success: 'Delete node successfully!',
            message_file_confirm: 'Do you want to delete the file?',


        },
        file: {
            table_speciesName: 'Species',
            table_populationName: 'Population',
            table_location: 'Location',
            table_fileStatus: 'Status',
            table_operate: 'Operations',
            table_kindId: 'Kind Id',
            table_kindName: 'Kind Name',
            table_materialId: 'Meterial Id',
            table_fieldId: 'Field Id',
            table_controlType: 'Control Tpye',
            table_father: 'Father',
            table_mother: 'Mother',
            table_remark: 'Remark',
            table_repeat: 'Repeat',


            button_search: 'Search',
            button_reset: 'Reset',
            button_export: 'Export',
            button_save: 'Save',
            button_cancel: 'cancel',


            label_meterial: 'Meterial Name',
            label_phenotype: 'Phenotype Name',
            label_operation: 'Operations',

            placeholder_meterial: 'Select the material name.',
            placeholder_phenotype: 'Select the phenotype name.',

            title_update: 'Update File Details',

            tooltip_update: 'Update',

            message_updateSuccess: 'Update Successfully!',
            message_updateFail: 'Update failed!',

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


        },

        showImage: {
            button: {
                search: 'Search',
                reset: 'Reset',
                cancel: 'Cancel',
                save: 'Save',
                nodeAdd: 'Add Node',
                upload:'Upload',
                edit:'Edit',
                node_update: 'Update Node',
                node_delete: 'Delete Node',
                node_detail: 'Node Details',
                download_remote: 'Download The Remote Connection File',
                image_download: 'Download Images',
                image_auto: 'Automatically Upload Images',
                image_add: 'Add Images',
                image_delete: 'Delete Images',
                image_analyse: 'Analyse Images',
                image_update: 'Update Images'
            },
            label: {
                current_status: 'Current Node Status',
                image_name: 'Image Title',
                image_uploader: 'Uploader',
                image_date_taken: 'Shooting Date',
                image_date_upload: 'Upload Date',
                select_all: 'Select All',

            },
            title: {
                node_create: 'Add A Node',
                node_update: 'Update A Node',
                node_detail: 'Node Details',

                image_auto: 'Automatically Upload Images',
                image_add: 'Add Images',
                image_update: 'Update Images',
                image_upload: 'Upload Images',

            },
            dialog: {
                label: {
                    nodeName: 'Node Name: ',
                    status: 'Status: ',
                    description: 'Description: ',
                    upload: 'Upload: ',

                    device:'Device: ',
                    date:'Date: ',
                    processing:'Processing: ',
                    keywords:'Keywords: ',

                    imageNewName:'New Name: ',
                    imageNewDate:'New Date: ',
                    comment:'Comment: ',

                    ip:'IP Adress: ',
                    catalog:'Image catalog: ',
                },
                placeholder: {
                    nodeName: 'Enter the node name.',
                    description: 'Enter the description.',
                    
                    device:'Enter the name of the shooting device.',
                    date:'Select the shooting Date.',
                    processing:'Enter the processing.',
                    keywords:'Enter the Keywords separated by commas.',

                    imageNewName:'Enter the new image name.',
                    imageNewDate:'Enter the new Date.',
                    comment:'Enter the comment.',

                    ip:'Enter the IP Adress.',
                    catalog:'Enter image catalog.',
                },
                message:{
                    nodeName: 'The node name cannot be empty!',
                    description: 'The description cannot be empty!',
                },
                tip:{
                    t1:'Please upload an image',
                    t2:'or Zip package',
                    t3:'Please name the images according to the format (material name_shooting date), for example:',
                    
                },
                other:{
                    description: 'Description: ',
                    dateSelction:'Date selection: ',
                    phenoAnalysis:'Phenotypic Image Analysis',
                    noImage:'No Image Yet',
                    noName:'No Name Yet',
                    dateSelction_empty:'The description information is empty!',
                    date_start:'Start Date',
                    date_end:'End Date',
                    to:'To',

                }
            }
        }

    }
}
