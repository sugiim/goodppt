class PptsController < ApplicationController
    
    
    def index
        @ppts = Ppt.order("p_order")
    end
    
    def index11
        @ppts = Ppt.all
        render :json => @ppts

    end
    
    def show
        @ppt = Ppt.where(ppt_id: params[:ppt_id])[0]
    end
    
    def show2
        @ppt = Ppt.where(ppt_id: params[:ppt_id])[0]
        render :json => @ppt
    end
    
    
    def new
    end
    
    def edit
    end
    
    def create
    end
    
    def update
        _ppt = Ppt.where(ppt_id: params[:ppt_id])[0]
        _ppt.point = _ppt.point+1
        ret = _ppt.save
        render :json => ret

    end
    
    def destroy
    end
    
    
    
end
