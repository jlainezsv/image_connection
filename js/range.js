function range() {
    return {
      minprice: 5, 
      maxprice: 500,
      min: 5, 
      max: 500,
      minthumb: 0,
      maxthumb: 0, 
      
      mintrigger() {   
        this.minprice = Math.min(this.minprice, this.maxprice - 5);      
        this.minthumb = ((this.minprice - this.min) / (this.max - this.min)) * 1;
      },
       
      maxtrigger() {
        this.maxprice = Math.max(this.maxprice, this.minprice + 5); 
        this.maxthumb = 100 - (((this.maxprice - this.min) / (this.max - this.min)) * 1);    
      }, 
    }
}