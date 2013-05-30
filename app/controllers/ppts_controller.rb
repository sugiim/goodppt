class PptsController < ApplicationController
    
    
    def index
        @ppts = Ppt.order("ppt_id")
    end
    
    def show
        @ppt = Ppt.where(ppt_id: params[:ppt_id])
    end
    
    def new
    end
    
    def edit
    end
    
    def create
    end
    
    def update
    end
    
    def destroy
    end
    
    
    
end
