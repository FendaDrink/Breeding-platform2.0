import { mapGamepadToXbox360Controller } from "@vueuse/core";

// en.js
export default {
    material: {
        header1: 'Phenotype File Selection',
        header2: 'Phenotype File Details',
        noFile: 'No files under this node.',

        button: {
            confirm: 'Confirm',
            search: 'Search',
            reset: 'Reset',
        },

        label: {
            id: 'Variety ID',
            name: 'Variety Name',
            materialNum: 'Material Number',
            field: 'Field Number',
            control: 'Control Type',
            father: 'Father',
            mother: 'Mother',
        },

        placeholder: {
            id: 'Please enter Variety ID.', 
            name: 'Please enter Variety Name.', 
            materialNum: 'Please enter Material Number.', 
            field: 'Please enter Field Number.', 
            father: 'Please enter Father.', 
            mother: 'Please enter Mother.',
        },

        table: {
            index: 'index',
            id: 'Variety ID',
            name: 'Variety Name',
            materialNum: 'Material Number',
            field: 'Field Number',
            control: 'Control Type',
            father: 'Father',
            mother: 'Mother',
            pedigree: 'Variety Pedigree',
            operate: 'Operations',

        },

        tooltip: {
            chart: 'Pedigree Chart',
            phenotype: 'Phenotype',
            Image: 'Image',
        },

        graph:{
            header:'Pedigree Chart'
        }
    },
    geneCompare:{
        header1: 'File Selection Management', 
        header2: 'File Upload Management',

        table: {
            fileName: 'File',
            species: 'Species',
            population: 'Population',
            year: 'Collection Year',
            dataType: 'Data Type',
        
            index: 'Index',
            taskId: 'Task ID',
            phenoFile: 'Phenotype File',
            genoFile: 'Genotype File',
            creator: 'Creator',
            submitTime: 'Submission Time',
            finishTime: 'Completion Time',
            taskStatus: 'Task Status',
            result: 'Predicted Results',
            downLoad: 'Download Result',
        },
        
        button: {
            result: 'Result',
            download: 'Download',
            data1: 'Original',
            data2: 'Latest',
            upload: 'Click to Upload',
            submit: 'Submit',
            cancel:'Cancel',
            confirm:'Confirm',
        },
        
        other: {
            fileSelect: 'File Selection',
            fileUpload: 'File Upload',
            phenoFile: 'Phenotype File',
            genoFile: 'Genotype File',
            mode1: 'Statistical Learning Model：',
            mode2: 'Machine Learning Model：',
            mode3: 'Deep Learning Model：',
            tile:'Predicted Results',
            tip:'The model prediction results are as follows: ',
            status1: 'Running', 
            status2: 'Completed', 
            status3: 'Failed', 
            busy: 'System is busy, please try again later...', 
            download_error: 'An error occurred while downloading the file, please contact the administrator!', 
            select_success: 'Selection successfully!'
        }
    },
    basic:{
        button:{
            add:'Add',
            update:'Update',
            delete:'Delete',
            export:'Export',
            search:'Search',
            reset:'Reset',
            cancel:'Cancel',
            save:'Save',

        },
        placeholder:{
            species:'Enter the species name',
            comment: 'Enter the content',
            population:'Enter the population name',
            trait:'Enter the trait type',
            traitName:'Enter the trait name',
            fullName:'Enter the full name',
            abbreviation:'Enter the abbreviation',
            factorTypeName:'Enter the factor Type Name',
            factorName:'Enter the factor name',
        },
        label:{
            species: 'Species', 
            comment: 'Comment',
            population:'Population',
            trait:'Trait Type',
            traitName:'Trait Name',
            fullName:'Full Name',
            abbreviation:'Abbreviation',
            factorTypeName:'Factor Type Name',
            factorName:'Factor Name',
        },
        title:{
            updateSpecies: 'Update Species Information', 
            addSpecies: 'Add Species Information',
        },
        message:{
            update_success: 'Update successfully!', 
            species_exist: 'This species name already exists!', 
            delete_confirm1: 'Are you sure you want to delete the item numbered', 
            delete_confirm2: '?', 
            delete_success: 'Delete successfully!', 


        },
        table:{
            index:'Index',
            species:'Species',
            comment:'Comment',
            operate:'Operations',
            population:'Population',
            trait:'Trait Type',
            traitName:'Trait Name',
            fullName:'Full Name',
            abbreviation:'Abbreviation',
            factorTypeName:'Factor Type Name',
            factorName:'Factor Name',
        },
        rule:{
            speciesName: 'Species name cannot be empty', 
            creator: 'Creator cannot be empty', 
            createTime: 'Creation time cannot be empty', 
            updater: 'Updater cannot be empty', 
            updateTime: 'Update time cannot be empty', 
            speciesId:'Species ID cannot be empty',
            populationName:'Population name cannot be empty',
            traitTypeId:'Trait type ID cannot be empty',
            traitTypeName:'Trait type name cannot be empty',
            traitId:'Trait ID cannot be empty',
            traitName:'Trait name cannot be empty',
            fullName:'Full name cannot be empty',
            abbreviation:'Abbreviation cannot be empty',
            factorTypeName:'Factor type name cannot be empty',
            factorName:'Factor name cannot be empty',
        }
    }
}
