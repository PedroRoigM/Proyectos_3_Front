// Archivo de índice para exportar todas las funciones de la biblioteca

import GetAdvisors from './GetAdvisors';
import GetDegrees from './GetDegrees';
import GetYears from './GetYears';
import GetTFG from './GetTFG';
import GetTFGpdf from './GetTFGpdf';
import GetTFGs from './GetTFGs';
import GetTFGsNames from './GetTFGsNames';
import GetUnverifiedTFGs from './GetUnverifiedTFGs';
import GetUsers from './GetUsers';

import DeleteTFG from './DeleteTFG';
import DeleteAdvisor from './DeleteAdvisor';
import DeleteDegree from './DeleteDegree';
import DeleteYear from './DeleteYear';

import PostAdvisor from './PostAdvisor';
import PostDegree from './PostDegree';
import PostTenTFGs from './PostTenTFGs';
import PostTFG from './PostTFG';
import PostYear from './PostYear';

import PutTFG from './PutTFG';

import PatchTfgFile from './PatchTfgFile';
import PatchUserRole from './PatchUserRole';
import PatchValidateTFG from './PatchValidateTFG';

import UpdateAdvisor from './UpdateAdvisor';
import UpdateDegree from './UpdateDegree';
import UpdateYear from './UpdateYear';

export {
    // Gets
    GetAdvisors,
    GetDegrees,
    GetYears,
    GetTFG,
    GetTFGpdf,
    GetTFGs,
    GetTFGsNames,
    GetUnverifiedTFGs,
    GetUsers,

    // Deletes
    DeleteTFG,
    DeleteAdvisor,
    DeleteDegree,
    DeleteYear,

    // Posts
    PostAdvisor,
    PostDegree,
    PostTenTFGs,
    PostTFG,
    PostYear,

    // Puts
    PutTFG,

    // Patches
    PatchTfgFile,
    PatchUserRole,
    PatchValidateTFG,

    // Updates
    UpdateAdvisor,
    UpdateDegree,
    UpdateYear
};