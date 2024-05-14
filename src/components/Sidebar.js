<div className="drawer drawer-end lg:drawer-open">
				<input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
				<div className="drawer-content ">
					{/* Page content here */}
					<label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/></svg>
					</label>

				</div> 
				<div className="drawer-side">
					<label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label> 
					<ul className="menu p-4 w-80 min-h-full bg-base-200 ">
					  {/* Sidebar content here */}
					  <li><button className="btn btn-neutral">Home</button></li>
					  <li><button className="btn btn-neutral">Search</button></li>
					  <li><button className="btn btn-neutral">Recent</button></li>
					  <li><button className="btn btn-neutral">Library</button></li>
					</ul>

				</div>
			</div>