# PrīmX - Ordering Portal Web App

Thanks for viewing our order platform solution for our client, PrīmX NA! https://primxna.com/

## Disclaimer:
This is a continuation of the PrimX group project as a solo contract, created, executed, and managed solely by Ryan Maas. 


## Description:

Our client, PrīmX, is an Industrial Concrete Flooring Distributor, who creates a unique ‘jointless’ concrete flooring product. They’re a small company, consisting of just five people, but have a national footprint across the United States and Canada. Their old process used Excel worksheets and there was no pipeline for the administrators to reference. The goal of this app is to help create a modern solution for their ordering platform.

This app is being used by 3 different user types: Contractor, Admin, and SuperAdmin, each with different levels of authorization. 

Contractors are able to enter in information regarding the project they want an estimate for, which will then provide an estimate to the contractor and add the estimate to the Admin's "open estimates" table on the "view pipeline" page. Once they have won their project, The contractor can the go back and reference their estimate via order number and company name and update the estimate's prices to be current with today. After ensuring the prices are current, the contractor can then push through their estimate as an order, which will notify the Admins by being added to the "pending orders" table on the "view pipeline" page. 

The Admin user will be able to login, view all of the open estimates, pending orders, and previously processed orders.  If there are any new pending orders, the Admin will be able to mark them as "processed".  This will allow PrīmX to view who is creating estimates, when they are needed, and in what quantities -- giving them previously unseen trends of their business pipeline. The Admin also has access to export any of the above data requierd.  Finally, the Admin user will also be able to update material prices, shipping costs, and control which licensees are active or inactive. 

The SuperAdmin is the only Admin account that is able to create another Admin account. Other than that, all Admin accounts have the ability to create and update the shipping costs, create and update materials and inventory, create placement and floor types, and create new licensees. 



## Prerequisites:

- Node.js: https://nodejs.org/en/
- PostgreSQL: https://www.postgresql.org/



## Installation:

To run this program, you will need to:

- [] Build the database in your SQL server with the code in "database.sql" file.
  - [] When building, start with all queries between the START HERE and STOP HERE comments, then follow instructions after STOP HERE to handle
       proper CSV import.
- [] Create a .env file in the root directory of the project with a single line starting with SERVER_SESSION_SECRET={your random string here},
     where the random string is 8+ random letters or numbers without the brackets.
- [] Run 'npm install' in your terminal to install the dependencies.
- [] Run 'npm run server' in one terminal, and 'npm run client' in another terminal.

To create a superadmin user you'll need a username and password with database id = 1. The following steps can help set this up:

- [] In the user.router.js file, comment out the existing /api/user/register POST route, and comment in the unsecured /api/user/register POST
     route currently disabled in the file. 
- [] Using Postman or another API testing program, do a POST route test to /api/user/register with a body of a JSON in the following format:
     {"username": "YOUR USERNAME HERE", "password": "YOUR PASSWORD HERE"} where the YOUR USERNAME HERE and YOUR PASSWORD HERE are your choices.
- [] After this, you should have a properly stored and hashed username and password in the user table that has access to the System Admin component
     under the AdminUpdates directory, where further admin creation and deletion is possible.
- [] Comment out he unsecured POST route just used, and comment back in the original.


## Usage:

To use this app, start the server and client in your terminal.  React will navigate to http://localhost:3000/ in your browser.
- Licensee: No login required.
  - CREATE NEW ESTIMATE:
    - On the landing page, enter all information regarding the project.
    - Select imperial or metric for measurement type.
    - Click the "next" button to bring up the rest of the project information to be entered.
    - Enter the rest of the project information to receive an estimate and click save estimate.
  - VIEW EXISTING ESTIMATE:
    - Click the "search for estimate" button.
    - Select the licenses/contractor name and enter in the estimate number at the top of the page.
    - The project information will auto populate onto the page.
    - Licensee can update the infomation and update if needed, then push through the estimate as an order by clicking the submit button.
- Admin: Login is required.
  - Admins can do everything that licensees can do, and more!
  - Upon login, the admin is brought to the admin landing page/dashboard.
  - The admin can either choose to view orders and estimates or choose to make updates to pricings, licensees, and inventory.
  - VIEW ORDERS AND ESTIMATES:
    - This page shows the admins the pipeline via 3 tables - pending orders, processed orders, and open estimates.
    - The admin can then process an order on the pending orders table by clicking the "process order" button which will move the order to the "processed orders" table.
    - The admin can also export each table to a csv file by clicking on the "export" button on the upper lefthand corner of the tables.
  - UPDATE LICENSEE/COSTS/INVENTORY:
    - This page has a dropdown menu to choose any of the following:
        - Licensees by company
        - Floor and placement types
        - Shipping costs by state
        - Material costs and inventory
        - System admin - (only shows up if logged in as system admin (id = 1))
    - LICENSEE  BY COMPANY:
      - Add a new licensee by entering the name into the input and clicking the blue button to submit.
      - Update licensee name by double clicking on the name in the table, making the change, then clicking enter.
    - FLOOR AND PLACEMENT TYPES:
      - Add a new floor type or placement type by entering in the type into the input fields.
      - Click the blue submit button to push through the new floor and/or placement type.
      - The floor and placement types are not editable.
    - SHIPPING COSTS BY STATE:
      - Add a new shipping ane by entering the information to he input fields and clicking the blue submit button.
      - Edit the costs by double clicking on the table, making the change, then hitting enter,
      - The "Ship To" is not editable.
    - MATERIAL COSTS AND INVENTORY:
      - Edit the material costs by double clicking on the line item, making the change, and hitting enter.
      - Unable to add new materials.
    - SYSTEM ADMIN (only shows if logged in as system admin / id = 1):
      - Add new admin by entering the username and password into the inputs and clicking the blue register button.
      - Delete and admin by clicking the delete button next to the admin you want to delete.



### Built With:

 - JavaScript/HTML/CSS
 - React, Redux, Redux Saga, React Router
 - Axios, Node.js, Express, SQL, PostgreSQL
 - Material-UI and Sweet Alert



### Acknowledgement:

We would like to thank PrimX and Jeanne Spoden for giving us the opportunity to work on this project, it was wonderful having such an attentive client.  We would also like to thank Prime Digital Academy and our instructor, Dane Smith, for giving us the tools to get here today.  Lastly, we would like to thank everyone in the Genocchi cohort for the love and support. 



### Support:

Please feel free to reach out to us with any feedback or suggestions.

- Ryan Maas: 
  - LinkedIn: https://www.linkedin.com/in/ryan-maas-0814/
  - GitHub: https://github.com/unomaas