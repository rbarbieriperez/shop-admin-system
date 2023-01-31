import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable"
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import './DataTable.scss';




type TColumn = {
    header: string,
    field: string,
    filterField: string,
    width: string
};

interface IDataTable {
    body: never[],
    Columns: Array<TColumn>,
    reload: () => void,
    deleteRow: (e: string) => void,
    moreInfo: (e: string) => void,
}   





export default function DataTableDynamic({body = [], Columns = [{header: '', field: '', filterField: '', width: ''}], reload, deleteRow, moreInfo}:IDataTable) {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState<any>(null);
    
    const dynamicColumns = Columns.map((col,i) => {
        return <Column style={{width: col.width}} className="table-column" key={col.field} field={col.field} header={col.header}/>;
    });

    const onGlobalFilterChange = (e: any) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const initFilters = () => {
        setFilters({
            'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
            'cod_product': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'product_name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'category_name': { value: null, matchMode: FilterMatchMode.IN },
            'description': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            'raw_cost': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            'final_cost': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            'earning_percentage': { value: null, matchMode: FilterMatchMode.BETWEEN },
            'total_earning': { value: null, matchMode: FilterMatchMode.EQUALS },
            'product_unity': { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue('');
    }

    useEffect(() => {
        initFilters();
    }, []);


    const _getOptionColumns = (rowData:any) => {
        return <span className="options-container">
            <Button id={rowData["cod_product"]} icon="pi pi-external-link" onClick={_onMoreInfoClick} className="p-button-rounded p-button-info"></Button>
            <Button id={rowData["cod_product"]} icon="pi pi-trash" onClick={_onDeleteClick} className="p-button-rounded p-button-danger"></Button>
        </span>
    }

    const _onDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.currentTarget?.getAttribute("id")) {
            deleteRow(e.currentTarget?.getAttribute("id") || '');
        }
        
    }


    const _onMoreInfoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.currentTarget?.getAttribute("id")) {
            moreInfo(e.currentTarget?.getAttribute("id") || '');
        }
    }
    

    return <>
        <div className="search-input">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
            </span>
            <div className="table-header">
                <Button icon="pi pi-refresh" onClick={reload}/>
            </div>
        </div>
        <DataTable 
            filters={filters}
            paginator 
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" 
            currentPageReportTemplate="Mostrando desde {first} a {last} de {totalRecords}" 
            rows={10} 
            showGridlines 
            className="table" 
            value={body} 
            >
                {dynamicColumns}
                <Column  style={{width: '10%'}} body={_getOptionColumns} className="table-column" key={'options'} field={'options'}  header={'Opciones'}/>
        </DataTable>
    </>
}