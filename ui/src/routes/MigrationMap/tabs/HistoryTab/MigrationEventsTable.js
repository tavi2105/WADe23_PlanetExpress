import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { colors } from '../../../../constants';
import { getType, getVocab } from './utils';

const MigrationEventsTable = ({ migrationEvents }) => {
   return migrationEvents.length > 0 && (
      <TableContainer sx={{ maxHeight: 200, backgroundColor: 'rgba(255, 255, 255, 0.5)', marginTop: 5 }}>
         <Table size="small" aria-label="sticky table" stickyHeader>
            <TableHead >
               <TableRow >
                  <TableCell align="left" style={{ color: colors.white, backgroundColor: colors.darkBlue }}>Origin</TableCell>
                  <TableCell align="left" style={{ color: colors.white, backgroundColor: colors.darkBlue }}>Destination</TableCell>
                  <TableCell align="left" style={{ color: colors.white, backgroundColor: colors.darkBlue }}>Number of individuals</TableCell>
                  <TableCell align="left" style={{ color: colors.white, backgroundColor: colors.darkBlue }}>Year</TableCell>
                  <TableCell align="left" style={{ color: colors.white, backgroundColor: colors.darkBlue }}>Age</TableCell>
                  <TableCell align="left" style={{ color: colors.white, backgroundColor: colors.darkBlue }}>Sex</TableCell>
               </TableRow>
            </TableHead>
            <TableBody >
               {migrationEvents.map(migEvent => {
                  const { age, destName, fromName, gender, migration, uri, value, year } = migEvent;
                  return (
                     <TableRow
                        key={uri.value}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, minHeight: 20 }}
                        vocab={getVocab(migration.migrationType.value)}
                        typeof={getType(migration.migrationType.value)}
                     >
                        <TableCell align='left' property={getType(fromName.fromType.value)}>
                           <span property={fromName.fromNameType.value} about={fromName.fromResource.value}>
                              {fromName.value}
                           </span>
                        </TableCell>
                        <TableCell align="left" property={getType(destName.destType.value)}>
                           <span property={destName.destNameType.value} about={destName.destResource.value}>
                              {destName.value}
                           </span>
                        </TableCell>
                        <TableCell align="left" property={getType(value.valueType.value)}>
                           <span property={value.dataType}>
                              {value.value}
                           </span>
                        </TableCell>
                        <TableCell align="left" property={getType(year.yearType.value)}>
                           <span>
                              {year.value}
                           </span>
                        </TableCell>
                        <TableCell align="left" property={getType(age.ageType.value)}>
                           <span>
                              {age.value}
                           </span>
                        </TableCell>
                        <TableCell align="left" property={getType(gender.genderType.value)}>
                           <span>
                              {gender.value}
                           </span>
                        </TableCell>
                     </TableRow>
                  )
               }

               )}
            </TableBody>
         </Table>
      </TableContainer>

   )

}

export default MigrationEventsTable