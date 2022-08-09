import * as React from 'react';
import styles from './EmployeeRecordForm.module.scss';
import { IEmployeeRecordFormProps } from './IEmployeeRecordFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import {ChoiceGroup,IChoiceGroupOption, textAreaProperties,Stack, IStackTokens, StackItem,IStackStyles,TextField } from 'office-ui-fabric-react'; 
import { DateTimePicker, DateConvention, TimeConvention, TimeDisplayControlType } from '@pnp/spfx-controls-react/lib/dateTimePicker'; 

import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";

import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption} from 'office-ui-fabric-react/lib/Dropdown';

import Service from './Service';

import { Button,PrimaryButton } from 'office-ui-fabric-react/lib/Button';

import {Icon} from 'office-ui-fabric-react/lib/Icon';

const sectionStackTokens: IStackTokens = { childrenGap: 10 };
const stackTokens = { childrenGap: 50 };
const stackStyles: Partial<IStackStyles> = { root: { padding: 10} };
const stackButtonStyles: Partial<IStackStyles> = { root: { width: 20 } };

const RadioRadioEmployType: IChoiceGroupOption[] = 

[  { key: "PERMANENT", text: "PERMANENT " , },  { key: "CONTRACT", text: "CONTRACT" },];  

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 300 },
};

let CapcoEmails='';

let RootUrl = '';

let ProjectMangerEmails='';

let FinalDateofdeactive='';

let FinalStatus='';

let RecordId='';

let drplocval;

let adminexists='false';

let HRexists='false';

let HRStatus='';

let itemId='';


let FinalUrl='';

let CapcoEmailIds='';


let RedirectUrl='';



export interface EmpDetals{
  EmpName:any;
  dtdoj:any;
  EmpID:any;
  bloodgroup:any;
  emconnum:any;
  Singleuser:boolean;
  HRExists:boolean;
  CapcoEmailId:any;
  ProjectName:any;
  ProjectManagerEmail:any;
  Grade:any;
  HCbussinessPatner:any;
  EmpTypeval:any;
  MyLocationVal: any;
  MyLocationKey:any;
  LocationListItems:any;
  empsign:any;
  hrsign:any;
  AdminExsists:boolean;
  accesscard:any;
  dtIssue:any;
  doorofacess:any;
  dtofbiometric:any;
  dtdeactive:any;
  dtresign:any;
  adminsign:any;
  Empsignpeople:any;
  HRsignPeople:any;
  AdminSignPeople:any;
  Hrcomments:any;
  AdminComments;
  FileValue:any;
  disableFileUpload:boolean;
  AttachmentFiles:any;
  

}

export default class EmployeeRecordForm extends React.Component<IEmployeeRecordFormProps, EmpDetals> {
  public _service: any;
  public GlobalService: any;
  protected ppl;

  public constructor(props:IEmployeeRecordFormProps){
    super(props);
    this.state={
      EmpName:null,
      dtdoj:null,
      EmpID:null,
      bloodgroup:null,
      emconnum:null,
      HRExists:false,
      Singleuser:false,
      CapcoEmailId:[],
      ProjectName:null,
      ProjectManagerEmail:[],
      Grade:null,
      HCbussinessPatner:null,
      EmpTypeval:null,
      LocationListItems: [],
      MyLocationVal: null,
      MyLocationKey:null,
      empsign:null,
      hrsign:null,
      AdminExsists:false,
      accesscard:null,
      dtIssue:null,
      doorofacess:null,
      dtofbiometric:null,
      dtdeactive:null,
      dtresign:null,
      adminsign:null,
      Empsignpeople:[],
      HRsignPeople:[],
      AdminSignPeople:[],
      Hrcomments:null,
      AdminComments:null,
      FileValue:[],
      disableFileUpload:false,
      AttachmentFiles:[]
      

    };

    RootUrl = this.props.url;

    this._service = new Service(this.props.url, this.props.context);

    this.GlobalService = new Service(this.props.url, this.props.context);

    let myitemId = this.getParam('SID');

    RecordId=myitemId;

    RedirectUrl=this.props.url;
       
    this.getHRandAdminGroupUserorNot();

    this.getAllLocations();

    
  }

  public  removeItemFromDetailFromList()
  {
     alert('great');

  }


  public async getuserrecords()
  {

    let myitemId = this.getParam('SID');
    RecordId=myitemId;
    let ItemInfo = await this._service.getItemByID(RecordId);
    this.setState({AttachmentFiles:ItemInfo.AttachmentFiles})

    console.log(ItemInfo);

    if (ItemInfo.Title != '') {

      

      this.setState({ EmpName: ItemInfo.EmpName })

      let strdoj= ItemInfo.DateofJoining.split('T');
      strdoj[0].replace("-","/");
 
      let mainstr=strdoj[0].replace("-","/");
 
       let strToDate = new Date(mainstr);
        this.setState({dtdoj:strToDate})
        this.setState({ EmpID: ItemInfo.EmpID })
       this.setState({ bloodgroup: ItemInfo.BloodGroup })
       this.setState({emconnum:ItemInfo.EmergencyContactNumber})
       
       if(ItemInfo.EMPSIGNId!=null)
       {

      this._getPeoplePickerItems23(ItemInfo.EMPSIGN.EMail);

       }

    }

  }

  //Check HRGroup or Not 
  public async getHRandAdminGroupUserorNot() {
  let mycurgroup= await this._service.getCurrentUserSiteGroups();
   console.log(mycurgroup.length);
   for (let grpcount = 0; grpcount < mycurgroup.length; grpcount++) {

    if(mycurgroup[grpcount].Title=='HR Group')
    {

      this.setState({ HRExists: true });
      HRexists='true';

    }

    if(mycurgroup[grpcount].Title=='Admin Group')
    {

      this.setState({ AdminExsists: true });
      adminexists='true';

    }

  }


   if(this.state.HRExists==false && this.state.AdminExsists==false)
  {
    let itemId = this.getParam('SID');

    if(itemId!="")
    {

 this.getuserrecords();

    }
 }

  if(this.state.HRExists==true)
  {

    let itemId = this.getParam('SID');

    //this.setState({ Title: data.target.value.replace(/[`#%&*|\?:'"<>\\/]/gi, '')});

    itemId.replace("",'');

    RecordId=itemId;

    let ItemInfo = await this._service.getItemByID(itemId);

    if (ItemInfo.Title != '' && ItemInfo.HRStatus=='Pending') {

      this.setState({ EmpName: ItemInfo.EmpName })

     let strdoj= ItemInfo.DateofJoining.split('T');
     strdoj[0].replace("-","/");

     let mainstr=strdoj[0].replace("-","/");

      let strToDate = new Date(mainstr);

      this.setState({dtdoj:strToDate})

      this.setState({ EmpID: ItemInfo.EmpID })
      this.setState({ bloodgroup: ItemInfo.BloodGroup })
      this.setState({emconnum:ItemInfo.EmergencyContactNumber})
      this.setState({empsign:ItemInfo.EMPSIGN})
      this.setState({ ProjectName: ItemInfo.PROJECTNAME })
      this.setState ({Grade:ItemInfo.GRADE})  
      this.setState ({HCbussinessPatner:ItemInfo.HCBUSINESSPARTNER})  
      this.setState ({hrsign:ItemInfo.HCOPSSIGN})
      this.setState({EmpTypeval:ItemInfo.EMPLOYMENTTYPE})
      this.setState({MyLocationKey:ItemInfo.LocationId})
      this.setState({AttachmentFiles:ItemInfo.AttachmentFiles})

       //People Picker

       if(ItemInfo.CAPCO_x0020_EMAILId!=null)
       {

      this._getPeoplePickerItems20(ItemInfo.CAPCO_x0020_EMAIL.EMail);
       }

       if(ItemInfo.PROJECTMANAGEREMAILId!=null)
       {

      this._getPeoplePickerItems21(ItemInfo.PROJECTMANAGEREMAIL.EMail);
       }

       if(ItemInfo.EMPSIGNId!=null)
       {

      this._getPeoplePickerItems23(ItemInfo.EMPSIGN.EMail);
       }

       if(ItemInfo.HCOPSSIGNId!=null)
       {

      this._getPeoplePickerItems24(ItemInfo.HCOPSSIGN.EMail);
       }

       if(ItemInfo.HRComments!=null)
       {

      this.setState({Hrcomments:ItemInfo.HRComments})
       }

     
      //End
      }

      else
      {

        alert('Record is not in pending')
      }

  }

  //#region 

  if(this.state.AdminExsists==true)
  {

    itemId = this.getParam('SID');

    itemId.replace("",'');

    let ItemInfo = await this._service.getItemByID(itemId);

    if (ItemInfo.HRStatus=='Approved' && ItemInfo.AdminStatus=='Pending') 
    
    {

     this.setState({ EmpName: ItemInfo.EmpName })
     this.setState({ EmpID: ItemInfo.EmpID })
     this.setState({ bloodgroup: ItemInfo.BloodGroup })
     this.setState({emconnum:ItemInfo.EmergencyContactNumber})
     this.setState({empsign:ItemInfo.EMPSIGN})
     this.setState({AttachmentFiles:ItemInfo.AttachmentFiles})
     

     //END

     //HR
                  
      this.setState({ ProjectName: ItemInfo.PROJECTNAME })
      this.setState ({Grade:ItemInfo.GRADE})  
      this.setState ({HCbussinessPatner:ItemInfo.HCBUSINESSPARTNER})  
      this.setState ({hrsign:ItemInfo.HCOPSSIGN})
      this.setState({EmpTypeval:ItemInfo.EMPLOYMENTTYPE})
      this.setState({MyLocationKey:ItemInfo.LocationId})
      this.setState({Hrcomments:ItemInfo.HRComments})

    //END

     //Admin

     this.setState({ accesscard: ItemInfo.ACCESSCARD })
     this.setState({ doorofacess: ItemInfo.DOORSFORACCESS })
     this.setState({AdminComments :ItemInfo.AdminComments})
     this.setState({AdminSignPeople:ItemInfo.ADMINSIGN})
     //Assign Dates

     //End

     HRStatus=ItemInfo.HRStatus;

     //Assinging dates

     //1)DOJ

     let strdoj= ItemInfo.DateofJoining.split('T');
     strdoj[0].replace("-","/");

     let mainstr=strdoj[0].replace("-","/");

      let strToDate = new Date(mainstr);

      this.setState({dtdoj:strToDate})

     //1)Date of Issue

    if(ItemInfo.DATEOFISSUE!=null || ItemInfo.DATEOFISSUE=="")
    {

     let strdoIssue= ItemInfo.DATEOFISSUE.split('T');
     strdoIssue[0].replace("-","/");

     let mainstr1=strdoIssue[0].replace("-","/");

      let strToDate1 = new Date(mainstr1);

      this.setState({dtIssue:strToDate1})

    }

     //2)Date of Bio

     if(ItemInfo.DATEOFBIOMETRIC!=null || ItemInfo.DATEOFBIOMETRIC=="")
     {

     let strdobimetric= ItemInfo.DATEOFBIOMETRIC.split('T');
     strdobimetric[0].replace("-","/");

     let mainstr2=strdobimetric[0].replace("-","/");

      let strToDate2 = new Date(mainstr2);

      this.setState({dtofbiometric:strToDate2})

     }

      //3)Date of resign

      if(ItemInfo.DATEOFRESIGN!=null || ItemInfo.DATEOFRESIGN=="")
     {


      let strresign= ItemInfo.DATEOFRESIGN.split('T');
      strresign[0].replace("-","/");
 
      let mainstr3=strresign[0].replace("-","/");
 
       let strToDate3 = new Date(mainstr3);
 
       this.setState({dtresign:strToDate3})
     }

       //4)Date of Deactivation

       if(ItemInfo.DATEOFDEACTIVATION!=null || ItemInfo.DATEOFDEACTIVATION=="")
       {

       let strdeact= ItemInfo.DATEOFDEACTIVATION.split('T');
       strdeact[0].replace("-","/");
  
        let mainstr4=strdeact[0].replace("-","/");
  
        let strToDate4 = new Date(mainstr4);
  
        this.setState({dtdeactive:strToDate4})

       }

        //People picker

        this._getPeoplePickerItems20(ItemInfo.CAPCO_x0020_EMAIL.EMail);

        this._getPeoplePickerItems21(ItemInfo.PROJECTMANAGEREMAIL.EMail);
  
        this._getPeoplePickerItems23(ItemInfo.EMPSIGN.EMail);
  
        this._getPeoplePickerItems24(ItemInfo.HCOPSSIGN.EMail);
  
        this.setState({Hrcomments:ItemInfo.HRComments})

        if(ItemInfo.ADMINSIGN!=null)
        {
 
       this._getPeoplePickerItems25(ItemInfo.ADMINSIGN.EMail);
 
        }

     //End

    }

    else
    {

      alert("Record dosen't exists or It is Rejected,Pending by HR")
    }
  }

 //#endregion

  }
  

public  getParam( name )
{
 name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
 var regexS = "[\\?&]"+name+"=([^&#]*)";
 var regex = new RegExp( regexS );
 var results = regex.exec(window.location.href);
 if( results == null )
 return "";
 else
 return results[1];
}

private async OnEmpClick()  {

     
    if(this.state.EmpName==null || this.state.EmpName=="")
    {

    alert('Please enter Employee Name');
    
   }

   else if(this.state.dtdoj==null || this.state.dtdoj=="")
    {

    alert('Please select date of joining');
    
   }

   else if(this.state.EmpID==null || this.state.EmpID=="")
    {

    alert('Please enter employee ID');
    
   }

   else if(this.state.bloodgroup==null || this.state.bloodgroup=="")
    {

    alert('Please enter blood group');
    
   }

   else if(this.state.emconnum==null || this.state.emconnum=="")
   {

   alert('Please enter employee number');
   
  }

  else if(this.state.emconnum.length>11)
  {
        
  alert('The mobile number should not be more that 10');
       
   }

  else if(this.state.Empsignpeople==null || this.state.Empsignpeople=="")
  {

   alert('Please complete signature');
  }
 
 

 else
 {

let date1=this.state.dtdoj.getDate();

let month1= (this.state.dtdoj.getMonth()+1);

let year1 =(this.state.dtdoj.getFullYear());

let FinalDateofJoin=month1+'/'+this.state.dtdoj.getDate() +'/' +year1;

    itemId = this.getParam('SID');

    itemId.replace("",'');

    let myfiles=[];

    for(var count=0;count<this.state.FileValue.length;count++)
    {
            
     myfiles.push(this.state.FileValue[count]);
    }


  if(itemId==null || itemId =='')
   {


  this._service.saveEmp(this.state.EmpName,FinalDateofJoin,this.state.EmpID,this.state.bloodgroup,this.state.emconnum,(this.state.Empsignpeople == null ? 0:this.state.Empsignpeople.Id),myfiles).then(function (data)
  {

    alert('Record submitted successfully');

    window.location.replace(RedirectUrl);

  });

}
else
{
  
   let ItemInfo = await this._service.getItemByID(itemId);

  if (ItemInfo.HRStatus=='Rejected') 
    
  {

  this._service.updateEmp(this.state.EmpName,FinalDateofJoin,this.state.EmpID,this.state.bloodgroup,this.state.emconnum,(this.state.Empsignpeople == null ? 0:this.state.Empsignpeople.Id),itemId,myfiles,this.state.AttachmentFiles).then(function (data)
  {

    alert('Record updated successfully');

    window.location.replace(RedirectUrl);

  });
}

}
  
 }

  }


 private  onHRApproveClick():void {

   
    if(this.state.EmpName==null || this.state.EmpName=="")
    {

    alert('Please enter Employee Name');
    
   }

   else if(this.state.dtdoj==null || this.state.dtdoj=="")
    {

    alert('Please select date of joining');
    
   }

   else if(this.state.EmpID==null || this.state.EmpID=="")
    {

    alert('Please enter employee ID');
    
   }

   else if(this.state.bloodgroup==null || this.state.bloodgroup=="")
    {

    alert('Please enter blood group');
    
   }

   else if(this.state.emconnum==null || this.state.emconnum=="")
   {

   alert('Please enter employee number');
   
  }
   //End

    //HR
   else if(this.state.CapcoEmailId==null || this.state.CapcoEmailId=="")
    {

    alert('Please enter Capco Email Id');
    
   }

   else if(this.state.ProjectName==null || this.state.ProjectName=="")
   {
    alert('Please enter Project Name');
    
   }

   else if(this.state.ProjectManagerEmail==null || this.state.ProjectManagerEmail=="")
   {
    alert('Please enter Project Manager Email');
    
   }

   else if(this.state.Grade==null || this.state.Grade=="")
   {
    alert('Please enter Grade');
    
    }

   else if(this.state.HCbussinessPatner==null || this.state.HCbussinessPatner=="")
   {
    alert('Please enter HCBussinessPatner');
    
    
   }

   else if(this.state.EmpTypeval==null || this.state.EmpTypeval=="")
   {
    alert('Please enter EmployeeType');
    
   }

   else if(this.state.MyLocationKey==null || this.state.MyLocationKey=="")
   {
    alert('Please select location');
    
   }

   else if(this.state.HRsignPeople==null || this.state.HRsignPeople=="")
   {

    alert('Please complete the signature');
   }
  

    else
    {

let date1=this.state.dtdoj.getDate();

let month1= (this.state.dtdoj.getMonth()+1);

let year1 =(this.state.dtdoj.getFullYear());

let FinalDateofJoin=month1+'/'+this.state.dtdoj.getDate() +'/' +year1;


let HrnewDate = new Date()
let Hrdate = HrnewDate.getDate();
let Hrmonth = HrnewDate.getMonth() + 1;
let Hryear = HrnewDate.getFullYear();

let HRApprovedDate=Hrmonth+'/'+Hrdate +'/' +Hryear;

 this._service.update_HRApproveorReject2(RecordId,this.state.ProjectName,this.state.Grade,this.state.HCbussinessPatner,this.state.EmpTypeval,this.state.MyLocationKey,this.state.Hrcomments,"Approved",(this.state.CapcoEmailId == null ? 0:this.state.CapcoEmailId.Id),(this.state.ProjectManagerEmail == null ? 0:this.state.ProjectManagerEmail.Id),(this.state.HRsignPeople == null ? 0:this.state.HRsignPeople.Id),HRApprovedDate).then(function (data)
{
  alert('Record Approved successfully');

  window.location.replace(RedirectUrl);
});


    }

  
 }
   
//END
 
  private  onHRRejectClick() :void {

        
    if(this.state.EmpName==null || this.state.EmpName=="")
    {

    alert('Please enter Employee Name');
    
   }

   else if(this.state.dtdoj==null || this.state.dtdoj=="")
    {

    alert('Please select date of joining');
    
   }

   else if(this.state.EmpID==null || this.state.EmpID=="")
    {

    alert('Please enter employee ID');
    
   }

   else if(this.state.bloodgroup==null || this.state.bloodgroup=="")
    {

    alert('Please enter blood group');
    
   }

   else if(this.state.emconnum==null || this.state.emconnum=="")
   {

   alert('Please enter employee number');
   
  }

  //End

    //HR
   else if(this.state.CapcoEmailId==null || this.state.CapcoEmailId=="")
    {

    alert('Please enter Capco Email Id');
    
   }

   else if(this.state.ProjectName==null || this.state.ProjectName=="")
   {
    alert('Please enter Project Name');
    
   }

   else if(this.state.ProjectManagerEmail==null || this.state.ProjectManagerEmail=="")
   {
    alert('Please enter Project Manager Email');
    
   }

   else if(this.state.Grade==null || this.state.Grade=="")
   {
    alert('Please enter Grade');
    
   }

   else if(this.state.HCbussinessPatner==null || this.state.HCbussinessPatner=="")
   {
    alert('Please enter HCBussinessPatner');
    
   }

   else if(this.state.EmpTypeval==null || this.state.EmpTypeval=="")
   {
    alert('Please enter EmployeeType');
    
   }

   else if(this.state.MyLocationKey==null || this.state.MyLocationKey=="")
   {
    alert('Please select location');
    
   }

   else if(this.state.HRsignPeople==null || this.state.HRsignPeople=="")
   {

    alert('Please complete the signature');
   }

     

  else
  {

    
let date1=this.state.dtdoj.getDate();

let month1= (this.state.dtdoj.getMonth()+1);

let year1 =(this.state.dtdoj.getFullYear());

let FinalDateofJoin=month1+'/'+this.state.dtdoj.getDate() +'/' +year1;

let HrnewDate = new Date()
let Hrdate = HrnewDate.getDate();
let Hrmonth = HrnewDate.getMonth() + 1;
let Hryear = HrnewDate.getFullYear();

let HRRejectDate=Hrmonth+'/'+Hrdate +'/' +Hryear;


this._service.update_HRApproveorReject2(RecordId,this.state.ProjectName,this.state.Grade,this.state.HCbussinessPatner,this.state.EmpTypeval,this.state.MyLocationKey,this.state.Hrcomments,"Rejected",(this.state.CapcoEmailId == null ? 0:this.state.CapcoEmailId.Id),(this.state.ProjectManagerEmail == null ? 0:this.state.ProjectManagerEmail.Id),(this.state.HRsignPeople == null ? 0:this.state.HRsignPeople.Id),HRRejectDate).then(function (data)
{
  alert('Record Rejected successfully');

  window.location.replace(RedirectUrl);
});

}

}

  
  private onAdminApproveClick():void {

    

    if(this.state.EmpName==null || this.state.EmpName=="")
    {

    alert('Please enter Employee Name');
    
   }

   else if(this.state.dtdoj==null || this.state.dtdoj=="")
    {

    alert('Please select date of joining');
    
   }

   else if(this.state.EmpID==null || this.state.EmpID=="")
    {

    alert('Please enter employee ID');
    
   }

   else if(this.state.bloodgroup==null || this.state.bloodgroup=="")
    {

    alert('Please enter blood group');
    
   }

   else if(this.state.emconnum==null || this.state.emconnum=="")
   {

   alert('Please enter employee number');
   
  }

    
    //End

    //HR
   else if(this.state.CapcoEmailId==null || this.state.CapcoEmailId=="")
    {

    alert('Please enter Capco Email Id');
    
   }

   else if(this.state.ProjectName==null || this.state.ProjectName=="")
   {
    alert('Please enter Project Name');
    
   }

   else if(this.state.ProjectManagerEmail==null || this.state.ProjectManagerEmail=="")
   {
    alert('Please enter Project Manager Email');
    
   }

   else if(this.state.Grade==null || this.state.Grade=="")
   {
    alert('Please enter Grade');
    
   }

   else if(this.state.HCbussinessPatner==null || this.state.HCbussinessPatner=="")
   {
    alert('Please enter HCBussinessPatner');
    
   }

   else if(this.state.EmpTypeval==null || this.state.EmpTypeval=="")
   {
    alert('Please enter EmployeeType');
    
   }

   else if(this.state.MyLocationKey==null || this.state.MyLocationKey=="")
   {
    alert('Please select location');
    
   }

    //END

    //Admin

  else if(this.state.accesscard==null || this.state.accesscard=="")
   {
    alert('Please enter AccessCard number');
    
   }

   else if(this.state.dtIssue==null || this.state.dtIssue=="")
   {
    alert('Please select Date of Issue');
    
   }

   else if(this.state.doorofacess==null || this.state.doorofacess=="")
   {
    alert('Please enter Dore of Access');
    
   }

   else if(this.state.dtofbiometric==null || this.state.dtofbiometric=="")
   {
    alert('Please select date of biometric');
    
   }

   else if(this.state.dtresign==null || this.state.dtresign=="")
   {
    alert('Please select date of resign');
    
    }

  
else if(this.state.AdminSignPeople==null || this.state.AdminSignPeople=="")
{

  alert('Please complete the signature')

}

   

     
   else
   {

    //Update by admin Approval 

  FinalUrl=window.location.href+'?SID='+RecordId

  

let date1=this.state.dtdoj.getDate();

let month1= (this.state.dtdoj.getMonth()+1);

let year1 =(this.state.dtdoj.getFullYear());

let FinalDateofJoin=month1+'/'+this.state.dtdoj.getDate() +'/' +year1;



//Date of Issue

let date2=this.state.dtIssue.getDate();

let month2= (this.state.dtIssue.getMonth()+1);

let year2 =(this.state.dtIssue.getFullYear());

let FinalDateofIssue=month2+'/'+this.state.dtIssue.getDate() +'/' +year2;


//End

//Date of biometric

let date3=this.state.dtofbiometric.getDate();

let month3= (this.state.dtofbiometric.getMonth()+1);

let year3 =(this.state.dtofbiometric.getFullYear());

let FinalDateofbiometric=month3+'/'+this.state.dtofbiometric.getDate() +'/' +year3;

//End

//Date of Resigin

let date4=this.state.dtresign.getDate();

let month4= (this.state.dtresign.getMonth()+1);

let year4 =(this.state.dtresign.getFullYear());

let FinalDateofresign=month4+'/'+this.state.dtresign.getDate() +'/' +year4;


//End

//Date of Deactivation

if(this.state.dtdeactive!=null)
{

let date5=this.state.dtdeactive.getDate();

let month5= (this.state.dtdeactive.getMonth()+1);

let year5 =(this.state.dtdeactive.getFullYear());

 FinalDateofdeactive=month5+'/'+this.state.dtdeactive.getDate() +'/' +year5;
}

else
{

  FinalDateofdeactive=null;
  
}

//End

let AdminnewDate = new Date()
let Admindate = AdminnewDate.getDate();
let Adminmonth = AdminnewDate.getMonth() + 1;
let Adminyear = AdminnewDate.getFullYear();

let AdminApproveDate=Adminmonth+'/'+Admindate +'/' +Adminyear;

this._service.update_AdminApproveorReject(this.state.EmpName,FinalDateofJoin,this.state.EmpID,this.state.bloodgroup,this.state.emconnum,(this.state.Empsignpeople == null ? 0:this.state.Empsignpeople.Id),this.state.ProjectName,this.state.Grade,this.state.HCbussinessPatner,this.state.EmpTypeval,(this.state.CapcoEmailId == null ? 0:this.state.CapcoEmailId.Id),(this.state.ProjectManagerEmail == null ? 0:this.state.ProjectManagerEmail.Id),this.state.MyLocationKey,HRStatus,this.state.accesscard,this.state.doorofacess,FinalDateofIssue,FinalDateofbiometric,FinalDateofresign,FinalDateofdeactive,"Approved", RecordId,(this.state.AdminSignPeople == null ? 0:this.state.AdminSignPeople.Id),this.state.AdminComments,AdminApproveDate).then(function (data)
{

 alert('Record Approved successfully');

  window.location.replace(RedirectUrl);
});

   }

    //END

  }

  private onAdminRejectClick():void {

    

    if(this.state.EmpName==null || this.state.EmpName=="")
    {

    alert('Please enter Employee Name');
    
   }

   else if(this.state.dtdoj==null || this.state.dtdoj=="")
    {

    alert('Please select date of joining');
    
   }

   else if(this.state.EmpID==null || this.state.EmpID=="")
    {

    alert('Please enter employee ID');
    
   }

   else if(this.state.bloodgroup==null || this.state.bloodgroup=="")
    {

    alert('Please enter blood group');
    
   }

   else if(this.state.emconnum==null || this.state.emconnum=="")
   {

   alert('Please enter employee number');
   
  }

  //End

    //HR
   else if(this.state.CapcoEmailId==null || this.state.CapcoEmailId=="")
    {

    alert('Please enter Capco Email Id');
    
   }

   else if(this.state.ProjectName==null || this.state.ProjectName=="")
   {
    alert('Please enter Project Name');
    
   }

   else if(this.state.ProjectManagerEmail==null || this.state.ProjectManagerEmail=="")
   {
    alert('Please enter Project Manager Email');
    
   }

   else if(this.state.Grade==null || this.state.Grade=="")
   {
    alert('Please enter Grade');
    
   }

   else if(this.state.HCbussinessPatner==null || this.state.HCbussinessPatner=="")
   {
    alert('Please enter HCBussinessPatner');
    
   }

   else if(this.state.EmpTypeval==null || this.state.EmpTypeval=="")
   {
    alert('Please enter EmployeeType');
    
   }

   else if(this.state.MyLocationKey==null || this.state.MyLocationKey=="")
   {
    alert('Please select location');
    
   }

    //END

    //Admin

  else if(this.state.accesscard==null || this.state.accesscard=="")
   {
    alert('Please enter AccessCard number');
    
   }

   else if(this.state.dtIssue==null || this.state.dtIssue=="")
   {
    alert('Please select Date of Issue');
    
   }

   else if(this.state.doorofacess==null || this.state.doorofacess=="")
   {
    alert('Please enter Dore of Access');
    
   }

   else if(this.state.dtofbiometric==null || this.state.dtofbiometric=="")
   {
    alert('Please select date of biometric');
    
   }

   else if(this.state.dtresign==null || this.state.dtresign=="")
   {
    alert('Please select date of resign');
    
   }

   

else if(this.state.AdminSignPeople==null || this.state.AdminSignPeople=="")
{

  alert('Please complete the signature')

}

  
   else
   {

    let date1=this.state.dtdoj.getDate();

    let month1= (this.state.dtdoj.getMonth()+1);
    
    let year1 =(this.state.dtdoj.getFullYear());
    
    let FinalDateofJoin=month1+'/'+this.state.dtdoj.getDate() +'/' +year1;
        
    
    //Date of Issue
    
    let date2=this.state.dtIssue.getDate();
    
    let month2= (this.state.dtIssue.getMonth()+1);
    
    let year2 =(this.state.dtIssue.getFullYear());
    
    let FinalDateofIssue=month2+'/'+this.state.dtIssue.getDate() +'/' +year2;
    
    
    //End
    
    //Date of biometric
    
    let date3=this.state.dtofbiometric.getDate();
    
    let month3= (this.state.dtofbiometric.getMonth()+1);
    
    let year3 =(this.state.dtofbiometric.getFullYear());
    
    let FinalDateofbiometric=month3+'/'+this.state.dtofbiometric.getDate() +'/' +year3;
    
    //End
    
    //Date of Resigin
    
    let date4=this.state.dtresign.getDate();
    
    let month4= (this.state.dtresign.getMonth()+1);
    
    let year4 =(this.state.dtresign.getFullYear());
    
    let FinalDateofresign=month4+'/'+this.state.dtresign.getDate() +'/' +year4;
    
    
    //End
    
    //Date of Deactivation

if(this.state.dtdeactive!=null)
{

let date5=this.state.dtdeactive.getDate();

let month5= (this.state.dtdeactive.getMonth()+1);

let year5 =(this.state.dtdeactive.getFullYear());

 FinalDateofdeactive=month5+'/'+this.state.dtdeactive.getDate() +'/' +year5;
}

else
{

  FinalDateofdeactive=null;
  
}
    
   

let AdminnewDate = new Date()
let Admindate = AdminnewDate.getDate();
let Adminmonth = AdminnewDate.getMonth() + 1;
let Adminyear = AdminnewDate.getFullYear();

let AdminRejectDate=Adminmonth+'/'+Admindate +'/' +Adminyear;

    
    //End

  FinalUrl=window.location.href+'?SID='+RecordId

this._service.update_AdminApproveorReject(this.state.EmpName,FinalDateofJoin,this.state.EmpID,this.state.bloodgroup,this.state.emconnum,(this.state.Empsignpeople == null ? 0:this.state.Empsignpeople.Id),this.state.ProjectName,this.state.Grade,this.state.HCbussinessPatner,this.state.EmpTypeval,(this.state.CapcoEmailId == null ? 0:this.state.CapcoEmailId.Id),(this.state.ProjectManagerEmail == null ? 0:this.state.ProjectManagerEmail.Id),this.state.MyLocationKey,"Pending",this.state.accesscard,this.state.doorofacess,FinalDateofIssue,FinalDateofbiometric,FinalDateofresign,FinalDateofdeactive,"Rejected", RecordId,(this.state.AdminSignPeople == null ? 0:this.state.AdminSignPeople.Id),this.state.AdminComments,AdminRejectDate).then(function (data)
{

  alert('Record Rejected successfully');

  window.location.replace(RedirectUrl);
});

 
   }

   //End

  }


  private changeReqName(data: any): void {

    this.setState({ EmpName: data.target.value });

  }

  private changedoorofacess(data: any): void {

    this.setState({ doorofacess: data.target.value });

  }


  public handlechangedoj = (date: any) => {

    this.setState({ dtdoj: date });

    }


    public ChangeEmpType(ev: React.FormEvent<HTMLInputElement>, option: any): void {  

      this.setState({  

        EmpTypeval: option.key  
  
        });  

      }


    private changeEmpID(data: any): void {

      this.setState({ EmpID: data.target.value });
  
    }

    private changeempsign(data: any): void {

      this.setState({ empsign: data.target.value });
  
    }

    private changeHrsign(data: any): void {

      this.setState({ hrsign: data.target.value });
  
    }


    private changebloodgroup(data: any): void {

      this.setState({ bloodgroup: data.target.value });
  
    }

    private chnageemconnum(data:any):void {

      this.setState({ emconnum: data.target.value });
    }

    private async _getPeoplePickerItems(items: any[]) {
      console.log('Items:', items);
  
      if(items.length>0)
      {
  
        CapcoEmails = items[0].text;
  
        let userInfo = this._service.getUserByLogin(items[0].loginName).then((info)=>{
        this.setState({CapcoEmailId:info});
        console.log(this.state);
        console.log(info);
   });
  
      }
  
      else
      {
  
        this.setState({CapcoEmailId:null});
      }
  
      //this.ppl.onChange([]);
  
    }

    private changeFileupload(data: any) {

      let LocalFileVal= this.state.FileValue;
      
       LocalFileVal.push(data.target.files[0]);
      
      
      this.setState({FileValue:LocalFileVal});
      
      if(this.state.FileValue.length>=1)
      {
      this.setState({disableFileUpload:true});
      
      }
      
      
      }

      private _removeItemFromDetail(Item: any) {
        console.log("itemId: " + Item.name); 
      
       let localFileValues=[];
      
       localFileValues=this.state.FileValue;
      
       if(localFileValues.length==1)
       {
      
        localFileValues=[];
       }
      
      
        for(var count=0;count<localFileValues.length;count++)
        {
      
          if(localFileValues[count].name==Item.name)
            {
              let Index=count;
      
              localFileValues.splice(Index,count);
      
            }
      
        }
      
        this.setState({FileValue:localFileValues,disableFileUpload:false});
      
      
      }

    public async  _getPeoplePickerItems20(UserEmail:string) {
      
  
      if(UserEmail.length>0)
      {
  
        
       

         let userInfo = this._service.getUserByEmail(UserEmail).then((info)=>{
         this.setState({CapcoEmailId:info});

          console.log(this.state);
          console.log(info);


   });
  
      }
  
      else
      {
  
        this.setState({CapcoEmailId:null});
      }


    }


    public async  _getPeoplePickerItems21(UserEmail:string) {
      
  
      if(UserEmail.length>0)
      {
  
         let userInfo = this._service.getUserByEmail(UserEmail).then((info)=>{
         this.setState({ProjectManagerEmail:info});

          console.log(this.state);
          console.log(info);


   });
  
      }
  
      else
      {
  
        this.setState({CapcoEmailId:null});
      }


    }



    public async  _getPeoplePickerItems23(UserEmail:string) {
      
  
      if(UserEmail.length>0)
      {
  
         let userInfo = this._service.getUserByEmail(UserEmail).then((info)=>{
         this.setState({Empsignpeople:info});

          console.log(this.state);
          console.log(info);


   });
  
      }
  
      else
      {
  
        this.setState({empsign:null});
      }


    }


    public async  _getPeoplePickerItems25(UserEmail:string) {
      
  
      if(UserEmail.length>0)
      {
  
         let userInfo = this._service.getUserByEmail(UserEmail).then((info)=>{
         this.setState({AdminSignPeople:info});

          console.log(this.state);
          console.log(info);


   });
  
      }
  
      else
      {
  
        this.setState({empsign:null});
      }


    }


    public async  _getPeoplePickerItems24(UserEmail:string) {
      
  
      if(UserEmail.length>0)
      {
  
         let userInfo = this._service.getUserByEmail(UserEmail).then((info)=>{
         this.setState({HRsignPeople:info});

          console.log(this.state);
          console.log(info);


   });
  
      }
  
      else
      {
  
        this.setState({HRsignPeople:null});
      }


    }



    private async _getPeoplePickerItems2(items: any[]) {
      console.log('Items:', items);
  
      if(items.length>0)
      {
  
        
        let userInfo = this._service.getUserByLogin(items[0].loginName).then((info)=>{
        this.setState({Empsignpeople:info});
        console.log(info);
   });
  
      }
  
      else
      {
  
        this.setState({Empsignpeople:null});
      }
  
      //this.ppl.onChange([]);
  
    }



    private async _getPeoplePickerItems1(items: any[]) {
      console.log('Items:', items);
  
      if(items.length>0)
      {
  
        ProjectMangerEmails = items[0].text;
  
        let userInfo = this._service.getUserByLogin(items[0].loginName).then((info)=>{
        this.setState({ProjectManagerEmail:info});
        console.log(info);
   });
  
      }
  
      else
      {
  
        this.setState({ProjectManagerEmail:null});
      }
  
      //this.ppl.onChange([]);
  
    }

    private changeAdminComments(data: any): void {

      this.setState({ AdminComments: data.target.value });
    }


    private changeHRcomments(data: any): void {

      this.setState({ Hrcomments: data.target.value });
    }



    
    private async _getPeoplePickerItems3(items: any[]) {
      console.log('Items:', items);

      
  
      if(items.length>0)
      {
  
         
        let userInfo = this._service.getUserByLogin(items[0].loginName).then((info)=>{
        this.setState({HRsignPeople:info});
        console.log(info);
   });
  
      }
  
      else
      {
  
        this.setState({HRsignPeople:null});
      }
  
      //this.ppl.onChange([]);
  
    }

    private async _getPeoplePickerItems4(items: any[]) {
      console.log('Items:', items);

      
  
      if(items.length>0)
      {
  
         
        let userInfo = this._service.getUserByLogin(items[0].loginName).then((info)=>{
        this.setState({AdminSignPeople:info});
        console.log(info);
   });
  
      }
  
      else
      {
  
        this.setState({AdminSignPeople:null});
      }
  
      //this.ppl.onChange([]);
  
    }





    private changeProjectName(data: any): void {

      this.setState({ ProjectName: data.target.value });
  
    }

    private changGrade(data: any): void {

      this.setState({ Grade: data.target.value });
  
    }

    private changeHCBussinesspatner(data:any):void {

      this.setState({ HCbussinessPatner: data.target.value });

    }

    private handleLocationType(event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void {

    
      this.setState({ MyLocationKey:item.key });

      drplocval=item.text;
  
      
    }

    public async getAllLocations() {

      var mApplicationLocal: any = [];
  
      var data = await this._service.GetAllLocations();
  
      console.log(data);
  
      var LocationTypes: any = [];
  
      for (var k in data) {
  
        LocationTypes.push({ key: data[k].ID, text: data[k].Title });
      }
  
      console.log(LocationTypes);
  
      this.setState({ LocationListItems: LocationTypes });
  
    }
  

//Admin


private changeaccesscard(data:any):void {

  this.setState({ accesscard: data.target.value });

}


public handlechangedtIssue = (date: any) => {

  this.setState({ dtIssue: date });

  }

  public handlechangedtofbiometric = (date: any) => {

    this.setState({ dtofbiometric: date });

  }

  public handlechangedtresign = (date: any) => {

    this.setState({ dtresign: date });

  }

  public handlechangedtdeactive = (date: any) => {

    this.setState({ dtdeactive: date });

  }

  private changeadminsign(data:any):void {

    this.setState({ adminsign: data.target.value });
  
  }

//End





  public render(): React.ReactElement<IEmployeeRecordFormProps> {

    //let filteredItems = this.filterListItems();

    return (
 
    <Stack tokens={stackTokens} styles={stackStyles} >
    <Stack>
    <b><p>Fields marked with an <label className={styles.redcolr}>*</label> are required. </p></b><br></br>
    <b><label className={styles.labelsFonts}>1.NAME (As It Should be 
Printed on ID card, First, 
Surname) <label className={styles.redcolr}>*</label></label></b><br/>
    <div> 
  <input type="text" name="txtEmpName" value={this.state.EmpName} onChange={this.changeReqName.bind(this)} className={styles.boxsize} disabled={this.state.HRExists == true || this.state.AdminExsists==true?true :false }/>
        
        </div><br/>

        <b><label className={styles.labelsFonts}>2. Date of Joining <label className={styles.redcolr}>*</label></label></b><br/>
        <div className={styles.datesize}> 
        <DateTimePicker  
          dateConvention={DateConvention.Date}  
          showLabels={false}
          value={this.state.dtdoj}  
          onChange={this.handlechangedoj}  disabled={this.state.HRExists == true || this.state.AdminExsists==true?true :false }/>  
          </div> <br></br><br></br>
          <b><label className={styles.labelsFonts}>3. Emp ID <label className={styles.redcolr}>*</label></label></b><br/>
          <div> 
  <input type="text" name="txtEmpID" value={this.state.EmpID} onChange={this.changeEmpID.bind(this)} className={styles.boxsize} disabled={this.state.HRExists == true || this.state.AdminExsists==true?true :false }/>
        
        </div><br/>

        <b><label className={styles.labelsFonts}>4. BloodGroup <label className={styles.redcolr}>*</label></label></b><br/>
        <div> 
  <input type="text" name="txtBloodGroup" value={this.state.bloodgroup} onChange={this.changebloodgroup.bind(this)} className={styles.boxsize} disabled={this.state.HRExists == true || this.state.AdminExsists==true?true :false }/>
        
        </div><br/>

        <b><label className={styles.labelsFonts}>5. EMERGENCY CONTACT NUM <label className={styles.redcolr}>*</label></label></b><br/>
        <div> 
  <input type="text" name="txtemgnum" value={this.state.emconnum} onChange={this.chnageemconnum.bind(this)} className={styles.boxsize} disabled={this.state.HRExists == true || this.state.AdminExsists==true?true :false }/>

  </div><br></br>
  <div>
  <b><label className={styles.labelsFonts}>6.Please provide a headshot image</label></b><br></br>
  <div> 
  <br></br>
  <input id="infringementFiles" type="file"  name="files[]"  onChange={this.changeFileupload.bind(this)} disabled={this.state.HRExists == true || this.state.AdminExsists==true || this.state.disableFileUpload==true?true :false }/>
  </div>
   <br></br>
   {this.state.AttachmentFiles.length>0 && this.state.AttachmentFiles.map((item,index) =>( 
    <div><a href={item.ServerRelativeUrl} target="_blank">{item.FileName} </a></div>
   ))}

  <br></br>
  <p>File number limit: 1Single file size limit: 5MBAllowed file types: Jpeg,PNP</p>
  {this.state.FileValue.map((item,index) =>(

<div className={styles.padcss}>  
{item.name} <Icon iconName='Delete'  onClick={(event) => {this._removeItemFromDetail(item)}}/>
</div>
 
))}
</div><br/><br></br>

        <b><label className={styles.labelsFonts}>EMP SIGN <label className={styles.redcolr}>*</label></label></b><br/>
        <div className={styles.boxsize}> 
  
  <PeoplePicker 
                context={this.props.context}
                //titleText="User Name"
                personSelectionLimit={1}
                showtooltip={true}
                required={true}
                disabled={this.state.HRExists == true || this.state.AdminExsists==true?true :false}
                onChange={this._getPeoplePickerItems2.bind(this)}
                showHiddenInUI={false}
                principalTypes={[PrincipalType.User]}
                defaultSelectedUsers={this.state.Empsignpeople ? [this.state.Empsignpeople.Title] : []}
                ref={c => (this.ppl = c)} 
                resolveDelay={1000} />         



        </div><br/>

        {this.state.HRExists == false && this.state.AdminExsists==false &&
        
       <Stack>       

      <PrimaryButton text="Submit" onClick={this.OnEmpClick.bind(this)} styles={stackButtonStyles} className={styles.Mybutton}/>

        <br></br>
        </Stack> 
  }
    </Stack>

    {(this.state.HRExists == true || this.state.AdminExsists==true) &&

    <Stack>

<b><label className={styles.labelsFonts}>(To be filled by Capco on-boarding team)</label></b><br></br><br></br>
<b><label className={styles.labelsFonts}>1.CAPCO EMAIL ID  <label className={styles.redcolr} >*</label></label></b><br/>
<div className={styles.boxsize}> 
<PeoplePicker 
                context={this.props.context}
                //titleText="User Name"
                personSelectionLimit={1}
                showtooltip={true}
                required={true}
                disabled={this.state.AdminExsists==true?true :false}
                onChange={this._getPeoplePickerItems.bind(this)}
                showHiddenInUI={false}
                principalTypes={[PrincipalType.User]}
                
                defaultSelectedUsers={this.state.CapcoEmailId ? [this.state.CapcoEmailId.Title] : []}
                ref={c => (this.ppl = c)} 
                resolveDelay={1000} />   

</div><br></br>

<b><label className={styles.labelsFonts}>2. PROJECT NAME <label className={styles.redcolr}>*</label></label></b><br/>
<div> 
<input type="text" name="txtProjectName" value={this.state.ProjectName} onChange={this.changeProjectName.bind(this)} className={styles.boxsize} disabled={this.state.AdminExsists==true?true :false }/>
</div><br></br>
<b><label className={styles.labelsFonts}>3. PROJECT MANAGER EMAIL <label className={styles.redcolr}>*</label></label></b><br/>
<div className={styles.boxsize} aria-disabled={this.state.AdminExsists==true?true :false}> 
<PeoplePicker 
                context={this.props.context}
                //titleText="User Name"
                
                personSelectionLimit={1}
                showtooltip={true}
                required={true}
                disabled={this.state.AdminExsists==true?true :false}
                onChange={this._getPeoplePickerItems1.bind(this)}
                showHiddenInUI={false}
                principalTypes={[PrincipalType.User]}
                defaultSelectedUsers={this.state.ProjectManagerEmail ? [this.state.ProjectManagerEmail.Title] : []}
                ref={c => (this.ppl = c)} 
                resolveDelay={1000} />   

</div><br></br>

<b><label className={styles.labelsFonts}>3. GRADE <label className={styles.redcolr}>*</label></label></b><br/>
<div> 
<input type="text" name="txtGrade" value={this.state.Grade} onChange={this.changGrade.bind(this)} className={styles.boxsize}disabled={this.state.AdminExsists==true?true :false }/>
</div><br></br>

<b><label className={styles.labelsFonts}>4. HC BUSINESS PARTNER <label className={styles.redcolr}>*</label></label></b><br/>
<div> 
<input type="text" name="txtHcPatner" value={this.state.HCbussinessPatner} onChange={this.changeHCBussinesspatner.bind(this)} className={styles.boxsize}disabled={this.state.AdminExsists==true?true :false }/>
</div><br></br>

<b><label className={styles.labelsFonts}>5. EMPLOYEE TYPE <label className={styles.redcolr}>*</label></label></b><br/>
<div> 

<ChoiceGroup className={styles.onlyFont}  id="EmpType"  name="EmpTypeoptions"   options={RadioRadioEmployType}   onChange={this.ChangeEmpType.bind(this)}  selectedKey={this.state.EmpTypeval}disabled={this.state.AdminExsists==true?true :false }/>

</div><br></br>

<b><label className={styles.labelsFonts}>6. Location <label className={styles.redcolr}>*</label> </label></b><br/>

<Dropdown className={styles.onlyFont}
    placeholder="Select  Location"
    options={this.state.LocationListItems}
    styles={dropdownStyles}
    selectedKey={this.state.MyLocationKey ? this.state.MyLocationKey : undefined} onChange={this.handleLocationType.bind(this)} disabled={this.state.AdminExsists==true?true :false }/>
  <br/><br></br>

          <b><label className={styles.labelsFonts}>HR Comments</label></b><br/>
           <div>  
           <textarea id="txtHrComments" value={this.state.Hrcomments} onChange={this.changeHRcomments.bind(this)} className={styles.textAreacss} disabled={this.state.AdminExsists==true?true :false }></textarea>
           </div><br/>

  <b><label className={styles.labelsFonts}>HC OPS SIGN <label className={styles.redcolr}>*</label></label></b><br/>
 
 
 
  <div className={styles.boxsize}> 
  
  <PeoplePicker 
                context={this.props.context}
                //titleText="User Name"
                personSelectionLimit={1}
                showtooltip={true}
                required={true}
                disabled={this.state.AdminExsists==true?true :false}
                onChange={this._getPeoplePickerItems3.bind(this)}
                showHiddenInUI={false}
                principalTypes={[PrincipalType.User]}
                defaultSelectedUsers={this.state.HRsignPeople ? [this.state.HRsignPeople.Title] : []}
                ref={c => (this.ppl = c)} 
                resolveDelay={1000} />         

 </div><br/>

 </Stack>

  }

{this.state.HRExists == true &&
<Stack>
 <Stack horizontal tokens={sectionStackTokens}>
          <StackItem>
          <PrimaryButton text="Approve" onClick={this.onHRApproveClick.bind(this)} styles={stackButtonStyles} className={styles.Mybutton}/>          
          </StackItem>
          <StackItem>
          <PrimaryButton text="Reject" onClick={this.onHRRejectClick.bind(this)} styles={stackButtonStyles} className={styles.Mybutton}/>         
          </StackItem>
          </Stack>
         
<br></br>
</Stack>

  }

{this.state.AdminExsists == true &&

<Stack>
<b><label className={styles.labelsFonts}>INTERNAL USE ONLY</label></b><br></br><br></br>

<b><label className={styles.labelsFonts}>1. ACCESS CARD # <label className={styles.redcolr}>*</label></label></b><br/>
  <div> 
  <input type="text" name="txtAccessCard" value={this.state.accesscard} onChange={this.changeaccesscard.bind(this)} className={styles.boxsize}/>
        
 </div><br/>
 <b><label className={styles.labelsFonts}>2. DATE OF ISSUE <label className={styles.redcolr}>*</label></label></b><br/>
        <div className={styles.datesize}> 
        <DateTimePicker  
          dateConvention={DateConvention.Date}  
          showLabels={false}
          value={this.state.dtIssue}  
          onChange={this.handlechangedtIssue}/>  
          </div> <br/>

  <b><label className={styles.labelsFonts}>3.DOORS FOR ACCESS <label className={styles.redcolr}>*</label></label></b><br/>
  <div> 
  <input type="text" name="txtdoracess" value={this.state.doorofacess} onChange={this.changedoorofacess.bind(this)} className={styles.boxsize}/>
  </div><br/>

  <b><label className={styles.labelsFonts}>4. DATE OF BIOMETRIC <label className={styles.redcolr}>*</label></label></b><br/>
        <div className={styles.datesize}> 
        <DateTimePicker  
          dateConvention={DateConvention.Date}  
          showLabels={false}
          value={this.state.dtofbiometric}  
          onChange={this.handlechangedtofbiometric}/>  
          </div> <br/> 


        <b><label className={styles.labelsFonts}>5. DATE OF RESIGN <label className={styles.redcolr}>*</label></label></b><br/>
        <div className={styles.datesize}> 
        <DateTimePicker  
          dateConvention={DateConvention.Date}  
          showLabels={false}
          value={this.state.dtresign}  
          onChange={this.handlechangedtresign}/>  
          </div> <br/> 

        <b><label className={styles.labelsFonts}>6. DATE OF DEACTIVATION </label></b><br/>
        <div className={styles.datesize}> 
        <DateTimePicker  
          dateConvention={DateConvention.Date}  
          showLabels={false}
          value={this.state.dtdeactive}  
          onChange={this.handlechangedtdeactive}/>  
          </div> <br/> <br></br>

          <b><label className={styles.labelsFonts}>Admin Comments</label></b><br/>
           <div>  
           <textarea id="txtAdminComments" value={this.state.AdminComments} onChange={this.changeAdminComments.bind(this)} className={styles.textAreacss}></textarea>
           </div><br/>

          <b><label className={styles.labelsFonts}>FACILITY/ADMIN SIGN <label className={styles.redcolr}>*</label></label></b><br/>
          
          <div className={styles.boxsize}>
                <PeoplePicker 
                context={this.props.context}
                //titleText="User Name"
                personSelectionLimit={1}
                showtooltip={true}
                required={true}
                disabled={false}
                onChange={this._getPeoplePickerItems4.bind(this)}
                showHiddenInUI={false}
                principalTypes={[PrincipalType.User]}
                defaultSelectedUsers={this.state.AdminSignPeople ? [this.state.AdminSignPeople.Title] : []}
                ref={c => (this.ppl = c)} 
                resolveDelay={1000}  /> 
                </div><br></br>


          <Stack horizontal tokens={sectionStackTokens}>
          <StackItem>
          <PrimaryButton text="Approve" onClick={this.onAdminApproveClick.bind(this)} styles={stackButtonStyles} className={styles.Mybutton}/>          
          </StackItem>
          <StackItem>
          <PrimaryButton text="Reject" onClick={this.onAdminRejectClick.bind(this)} styles={stackButtonStyles} className={styles.Mybutton}/>         
          </StackItem>
          </Stack>

</Stack>
}

  
      </Stack>


    );
  }
}


