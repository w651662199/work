Component({
  options:{
    multipleSlots: true
  },
  properties:{
    dialogItems:{
      type: Object,
      value: {}
    }
  },
  data:{
    
  },
  ready: function () {
    console.log(this.data.dialogItems);
  },
  methods: {
    cancelEvent(){
      this.triggerEvent("hideDialog");
    }
  }
})