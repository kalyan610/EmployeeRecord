import {sp} from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import "@pnp/sp/lists";
import "@pnp/sp/views";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import "@pnp/sp/fields";
import "@pnp/sp/attachments";
import "@pnp/sp/files";

export default class Service {

    public mysitecontext: any;

    public constructor(siteUrl: string, Sitecontext: any) {
        this.mysitecontext = Sitecontext;


        sp.setup({
            sp: {
                baseUrl: siteUrl

            },
        });

    }


    public async isCurrentUserMemberOfGroup(groupName: string) {
        return await sp.web.currentUser.groups().then((groups: any) => {
            let groupExist = false;
            groups.map((group: any) => {
                if (group.Title = groupName) {
                    groupExist = true;
                }
            });
            return groupExist;
        });

    }


    public async getItemByID(ItemID: any): Promise<any> {
        try {

    const selectedList = 'Employee Record';
    const Item: any[] = await sp.web.lists.getByTitle(selectedList).items.select("*,CAPCO_x0020_EMAIL/EMail,PROJECTMANAGEREMAIL/EMail,EMPSIGN/EMail,HCOPSSIGN/EMail,ADMINSIGN/EMail").expand("CAPCO_x0020_EMAIL,PROJECTMANAGEREMAIL,EMPSIGN,HCOPSSIGN,ADMINSIGN").filter("ID eq '" + ItemID + "'").get();
            return Item[0];
        } catch (error) {
            console.log(error);
        }
    }

    public async getCurrentUserSiteGroups(): Promise<any[]> {

        try {

            return (await sp.web.currentUser.groups.select("Id,Title,Description,OwnerTitle,OnlyAllowMembersViewMembership,AllowMembersEditMembership,Owner/Id,Owner/LoginName").expand('Owner').get());

        }
        catch {
            throw 'get current user site groups failed.';
        }

    }


    public async getUserByLogin(LoginName:string):Promise<any>{
        try{
            const user = await sp.web.siteUsers.getByLoginName(LoginName).get();
            return user;
        }catch(error){
            console.log(error);
        }
    }

    public async getUserByEmail(LoginName:string):Promise<any>{
        try{
            const user = await sp.web.siteUsers.getByEmail(LoginName).get();
            return user;
        }catch(error){
            console.log(error);
        }
    }


    public async GetListNameandURL():Promise<any>
    {
 
     return await sp.web.lists.getByTitle("URLandListname").items.select('Title','URL','ColName').expand().get().then(function (data) {
 
     return data;
 
     });
 
    }

    public async GetAllLocations():Promise<any>
   {

    return await sp.web.lists.getByTitle("Locations").items.select('Title','ID').expand().get().then(function (data) {

    return data;


    });


   }


    public async getCurrentUser(): Promise<any> {
        try {
            return await sp.web.currentUser.get().then(result => {
                return result;
            });
        } catch (error) {
            console.log(error);
        }
      }


    



      private async saveEmp(MyEmpName:string,MyDOJ:string,MyEmpId:string,Mybloodgroup:string,MyEmgnumber:string,MyEmpSign:string):Promise<any>     
      {       
        
        
        let Myval='Completed';

        let MyListTitle='Employee Record';

        try
        {
    
        let Filemal=[];
    
            
        let Varmyval= await sp.web.lists.getByTitle(MyListTitle).items.add({
        
        Title:"Employee Submitted Record",
        EmpName:MyEmpName,
        DateofJoining:MyDOJ,
        EmpID:MyEmpId,
        BloodGroup:Mybloodgroup,
        EmergencyContactNumber:MyEmgnumber,
        EMPSIGNId:MyEmpSign
        
        
        }).then (async r => {
          
        return Myval;
    
        })
    
       return Varmyval;
    
        
      }
    
    
    
      catch (error) {
        console.log(error);
      }

    }

    private async update_AdminApproveorReject(MyEmpName:string,MyDOJ:string,MyEmpId:string,Mybloodgroup:string,MyEmgnumber:string,MyEmpSign:string,MyProjectname:string,MyGrade:string,MyHCBussinessPatner:string,MyEmpType:string,MyCapcoEmailId:string,MyProjectManager:string,MyLocation:string,MyHRStatus:string,MyAccessCard:string,Mydoorofaccess:string,MyFinalDateofIssue:string,MyFinalDateofbiometric:string,MyFinalDateofresign:string,MyFinalDateofdeactive:string,MyAdminStatus:string,MyRecordId:number,MyAdminSign:string,MyAdminComments:string,MyAdminApproveDate:string)
    {

        let Myval='Completed';

        let MyListTitle='Employee Record';

        try
        {
    
        let Filemal=[];

        let list = sp.web.lists.getByTitle(MyListTitle);
        let Varmyval = await list.items.getById(MyRecordId).update({

        //Emp Update
        
        Title:"Updated by Admin",
        EmpName:MyEmpName,
        DateofJoining:MyDOJ,
        EmpID:MyEmpId,
        BloodGroup:Mybloodgroup,
        EmergencyContactNumber:MyEmgnumber,
        EMPSIGNId:MyEmpSign,

        //End

        //HR Approve

        
        PROJECTNAME:MyProjectname,
        GRADE:MyGrade,
        HCBUSINESSPARTNER:MyHCBussinessPatner,
        EMPLOYMENTTYPE:MyEmpType,
        HRStatus:MyHRStatus,
        CAPCO_x0020_EMAILId:MyCapcoEmailId,
        PROJECTMANAGEREMAILId:MyProjectManager,
        LocationId:MyLocation,
        

        //End

        //Admin
        ACCESSCARD:MyAccessCard,
        DOORSFORACCESS:Mydoorofaccess,
        DATEOFISSUE:MyFinalDateofIssue,
        DATEOFBIOMETRIC:MyFinalDateofbiometric,
        DATEOFRESIGN:MyFinalDateofresign,
        DATEOFDEACTIVATION:MyFinalDateofdeactive,
        AdminStatus:MyAdminStatus,
        ADMINSIGNId:MyAdminSign,
        AdminComments:MyAdminComments,
        AdminApprovalDT:MyAdminApproveDate

        //End
        
        
        }).then (async r => {
          
        return Myval;
    
        })
    
       return Varmyval;
            
      }
    
        
      catch (error) {
        console.log(error);
      }

    }

    private async updateEmp(MyEmpName:string,MyDOJ:string,MyEmpId:string,Mybloodgroup:string,MyEmgnumber:string,MyEmpSign:string,MyRecordId:number)
    {

        let Myval='Completed';

        let MyListTitle='Employee Record';

        try
        {
    
        let Filemal=[];

        let list = sp.web.lists.getByTitle(MyListTitle);
        let Varmyval = await list.items.getById(MyRecordId).update({

        //Emp Update
        
        Title:"Updated by Employee",
        EmpName:MyEmpName,
        DateofJoining:MyDOJ,
        EmpID:MyEmpId,
        BloodGroup:Mybloodgroup,
        EmergencyContactNumber:MyEmgnumber,
        EMPSIGNId:MyEmpSign,
        HRStatus:'Pending',
        AdminStatus:'Pending'       
        
        
        }).then (async r => {
          
        return Myval;
    
        })
    
       return Varmyval;
            
      }
    
        
      catch (error) {
        console.log(error);
      }


    }


    private  async update_HRApproveorReject(MyEmpName:string,MyDOJ:string,MyEmpId:string,Mybloodgroup:string,MyEmgnumber:string,MyEmpSign:string,MyProjectname:string,MyGrade:string,MyHCBussinessPatner:string,MyEmpType:string,MyCapcoEmailId:string,MyProjectManager:string,MyLocation:string,MyHRStatus:string,MyRecordId:number,Myhrsign:string,MyHrComments:string)
      {       
                
        let Myval='Completed';

        let MyListTitle='Employee Record';

        try
        {

        let Filemal=[];

        let list = sp.web.lists.getByTitle(MyListTitle);
        let Varmyval = await list.items.getById(MyRecordId).update({

        //Emp Update
        
        Title:"Updated by HR",
        EmpName:MyEmpName,
        DateofJoining:MyDOJ,
        EmpID:MyEmpId,
        BloodGroup:Mybloodgroup,
        EmergencyContactNumber:MyEmgnumber,
        EMPSIGNId:MyEmpSign,

        //End

        //HR Approve

        
        PROJECTNAME:MyProjectname,
        GRADE:MyGrade,
        HCBUSINESSPARTNER:MyHCBussinessPatner,
        EMPLOYMENTTYPE:MyEmpType,
        HRStatus:MyHRStatus,
        CAPCO_x0020_EMAILId:MyCapcoEmailId,
        PROJECTMANAGEREMAILId:MyProjectManager,
        LocationId:MyLocation,
        HCOPSSIGNId:Myhrsign,
        HRComments:MyHrComments,

        //End

        //AdminStatus
        AdminStatus:'Pending'

        //End
        
    }).then (async r => {
          
        return Myval;
    
        })
    
       return Varmyval;
            
      }
    
        
      catch (error) {
        console.log(error);
      }
   

    }

    private  async update_HRApproveorReject2(MyRecordId:number,MyProjectname:string,MyGrade:string,MyHCBussinessPatner:string,MyEmpType:string,MyLocation:string,MyHrComments:string,MyHRStatus:string,MyCapcoEmailId:string,MyProjectManager:string,Myhrsign:string,MyHRApproveDate:string)
    {       
              
      let Myval='Completed';

      let MyListTitle='Employee Record';

      try
      {

      let Filemal=[];

      let list = sp.web.lists.getByTitle(MyListTitle);
      let Varmyval = await list.items.getById(MyRecordId).update({

      //Emp Update
      
      Title:"Updated by HR",
      PROJECTNAME:MyProjectname,
      GRADE:MyGrade,
      HCBUSINESSPARTNER:MyHCBussinessPatner,
      EMPLOYMENTTYPE:MyEmpType,
      LocationId:MyLocation,
      HRComments:MyHrComments,
      AdminStatus:'Pending',
      HRStatus:MyHRStatus,
      CAPCO_x0020_EMAILId:MyCapcoEmailId,
      PROJECTMANAGEREMAILId:MyProjectManager,
      HCOPSSIGNId:Myhrsign,
      HRApprovalDateTime:MyHRApproveDate

      //End
      
  }).then (async r => {
        
      return Myval;
  
      })
  
     return Varmyval;
          
    }
  
      
    catch (error) {
      console.log(error);
    }
 

  }


    

}


    


     







