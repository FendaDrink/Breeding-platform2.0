// en.js
export default {
    environment: {
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
            table_start:'Start Date',
            table_end:'End Date',
            table_longitude:'Longitude',
            table_latitude:'Latitude',
            table_location: 'Location',
            table_fileStatus: 'Status',
            table_operate: 'Operations',
            table_previousVersions: 'Versions',
            table_merge: 'Merger',


            tooltip_detail: 'Details',
            tooltip_view1: 'Factor Classification Visualization',
            tooltip_view2: 'Factor Analysis Visualization',
            tooltip_delete: 'Delete',
            tooltip_historicalVersions: 'View Previous Versions',
            tooltip_merge: 'Merge',


            placeholder_fileName: 'Enter the file name.',
            placeholder_node: 'Enter the node name.',
            placeholder_comment: 'Enter the comment.',
            placeholder_location:'Enter the location.',
            placeholder_longitude:'Enter the longitude.',
            placeholder_latitude:'Enter the latitude.',

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
            dialog_location:'Location: ',
            dialog_longitude:'longitude: ',
            dialog_latitude:'latitude: ',

            name_require:'The file name format must be "Species_Population"',


            message_getListFailed: "Retrieving list failed!",
            message_input_fileName: "File name cannot be empty!",
            message_input_nodeName: "Node name cannot be empty!",
            message_input_commentName: "Comment name cannot be empty!",
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
            message_update_success: "Update !",
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

            message_area1: 'Please enter the region (in Chinese).', 
            message_area2: 'The region must be entered in Chinese only.', 
            message_longitude: 'Please enter the longitude value.', 
            message_latitude: 'Please enter the latitude value.',
            message_merge_success:'Merge successfully!',
        },
        file: {
            table_operate: 'Operations',
            table_env:'Environment Id',
            table_location:'Location',
            table_date:'Date',
            table_comment:'Comment',


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
            table_factorName:'Factor Name',
            table_name:'Name',
            table_fullName: 'Full Name',
            table_abbreviationName: 'Abbreviation',
            table_remark: 'Remark',
            table_type: 'Type',
            table_location: 'Location',
            table_longitude: 'Longitude',
            table_latitude: 'Latitude',

            label_country: 'Country',
            label_location: 'Location',
            label_longitude: 'Longitude',
            label_latitude: 'Latitude',


            header1: 'Search Environmental Factors',
            header2: 'Search Locations',


        },
        categoryVisual:{
            sunBurstChat_title:'Environmental Factors',
            header:'Factor Classification Visualization',
            unclassified_factor:'Unclassified factor',
            table_label:{
                index:'Index',
                factorName:'Trait Name',
                fullName:'Full Name',
                abbreviationName:'Abbreviation',
                remark:'Remark'
            }
        },
        factorVisual:{
            factorSelect:{
                header:'Environmental Factors Selection',
                file_select:'File Selection',
                file_select_placeholder:'Please select the file',
                variable_select:'Environment Variables Selection',
                variable_select_placeholder:'Please select the environment Factors',
                select_date:'Date Selection',
                dateRange:{
                    start:'Start Date',
                    end:'End Date',
                    last_week:'last week',
                    last_month:'last month',
                    last_threeMonth:'last 3 months'
                },
                to:'to',
                save:'Save As Image'
            },
            analysis_header:'Analysis Visualization'
        },
        dataCatch:{
            upload:{
                header:'Environment Information Capture Module',
                title:'Upload environment information file',
                prompt:'Click Upload/Drag file',
                download_btn:'Download template file',
                submit_btn:'Submit'
            },
            table:{
                title:'Task Information Display',
                refresh_btn:'Refresh task list',
                index:'Index',
                indexId:'Task Num',
                createdBy:'Creator',
                createTime:'Create Time',
                status:'Task Status',
                inputFile_download:'Input file download',
                result_download:'Result download',
                prompt:'Prompt',
                option:'option'
            },
            table_inner:{
                export:'Export CSV',
                promptInfo:'View prompt',
                delete:'Delete',
                del_message:'Confirm delete this task?'
            },
            message:{
                getSuccess:'Obtain data successfully!',
                getFailure:'Obtain data failed',
                uploadSuccess:'Submit successfully',
                uploadFailure:'Submit failed',
                upload_warning:'Please upload file',
                upload_csv:'Please upload .csv file',
                saveAs:'Template_File.csv',
                download_failure:'Error downloading file, please contact administrator!',
                export_fail:'You cannot export a csv file if the task is not successful',
                error:'Error',
                del_message:'Confirm delete this task?',
                warning:'Prompt',
                confirm:'Confirm',
                cancel:'Cancel',
                delSuccess:'Delete successfully!',
                delFailure:'Delete failed!',
            }
        },
        visualization:{
            select_date:'Data Selection',
            dateRange:{
                start:'Start Date',
                end:'End Date',
                last_week:'last week',
                last_month:'last month',
                last_threeMonth:'last 3 months'
            },
            to:'to',
            barChart_title:'File Quantity Statistics',
            lineChart_title:'File Quantity Change Statistics',
            header:'Environmental Visualization',
            feature:{
                save:'Save As Image',
                mytool1:'Select All/Deselect All',
                mytool2:'Expand/Collapse Legend',
            },
            chooseAll: "All Selected!",
            chooseAllCancel: "All Selection Canceled!",
        }
    }
}
