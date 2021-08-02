# Primx - App

## Description
Duration: 2 Week Sprint
This app was created as a solution to Primx's estimate and order placement process. Their process used excel worksheets and there was no pipeline for the administrators to reference. This app is being used by 3 different user types: Contractor, Admin, and SuperAdmin, each with different levels of authorization. Contractors are able to enter in information regarding the project they want an estimate for, which will then provide an estimate to the contractor and add the estimate to the Admin's "open estimates" table on the "view pipeline" page. The contractor can the go back and reference their estimate via order number and company name and make any adjustments/updates to the estimate. Once they have won their project, they can push through their estimate as an order, which will notify the Admins by being added to the "pending orders" table on the "view pipeline" page. Once the order is processed, the Admin can confirm in the app that the order has been processed by clicking the "order processed" button that is located on the order on the far right of the line item. The SuperAdmin is the only admin that is able to create another administrator account. Other than that, all admins have the ability to create and update the shipping costs, create and update materials and inventory, create placement and floor types, and create new licensees. 

## Prerequisites
Node.js: https://nodejs.org/en/
PostgreSQL: https://www.postgresql.org/

## Installation
To run this program, you will need to:
[] Build the database in your SQL server with the code in "database.sql" file. 
[] Run 'npm install' in your terminal to install the dependencies.
[] Run 'npm run server' in one terminal, and 'npm run client' in another terminal.

## Usage
To use this app, start the server and client in your terminal.  React will navigate to http://localhost:3000/ in your browser.
Licensee: no login required
  - CREATE NEW ESTIMATE
    - on the landing page, enter all information regarding the project
    - select imperial or metric for measurement type
    - click the "next" button to bring up the rest of the project information to be entered
    - enter the rest of the project information to receive an estimate and click save estimate
  - VIEW EXISTING ESTIMATE 
    - click the "search for estimate" button
    - select the licenses/contractor name and enter in the estimate number at the top of the page
    - the project information will auto populate onto the page
    - licensee can update the infomation and update if needed, then push through the estimate as an order by clicking the submit button
Admin: login required
note: Admins can do everything that licensees can do and more
  - upon login, the admin is brought to the admin landing page/dashboard
  - the admin can either choose to view orders and estimates or choose to make updates to pricings, licensees, and inventory
  - VIEW ORDERS AND ESTIMATES
    - this page shows the admins the pipeline via 3 tables - pending orders, processed orders, and open estimates
    - the admin can then process an order on the pending orders table by clicking the "process order" button which will move the order to the "processed orders" table
    - the admin can also export each table to a csv file by clicking on the "export" button on the upper lefthand corner of the tables
  - UPDATE LICENSEE/COSTS/INVENTORY
    - this page has a dropdown menu to choose any of the following:
        - Licensees by company
        - Floor and placement types
        - Shipping costs by state
        - Material costs and inventory
        - System admin - (only shows up if logged in as system admin (id = 1))
    - LICENSEE  BY COMPANY
      - add a new licensee by entering the name into the input and clicking the blue button to submit
      - update licensee name by double clicking on the name in the table, making the change, then clicking enter
    - FLOOR AND PLACEMENT TYPES
      - add a new floor type or placement type by entering in the type into the input fields
      - click the blue submit button to push through the new floor and/or placement type
      - the floor and placement types are not editable
    - SHIPPING COSTS BY STATE
      - add a new shipping ane by entering the information to he input fields and clicking the blue submit button
      - edit the costs by double clicking on the table, making the change, then hitting enter
      - the "Ship To" is not editable
    - MATERIAL COSTS AND INVENTORY
      - edit the material costs by double clicking on the line item, making the change, and hitting enter
      - unable to add new materials
    - SYSTEM ADMIN (only shows if logged in as system admin / id = 1)
      - add new admin by entering the username and password into the inputs and clicking the blue register button
      - delete and admin by clicking the delete button next to the admin you want to delete

## Accessibility: 


## Built With
JavaScript/HTML/CSS, React, Redux, Redux Saga, React Router, Node.js, Express, SQL, Material-ui, Axios, PostgreSQL, Snackbar. 

## Acknowledgement


## Support

